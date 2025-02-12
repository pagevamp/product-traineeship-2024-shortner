import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { env } from '@/config/env.config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/users/entities/user.entity';
import { Repository, TypeORMError } from 'typeorm';
import { hash, compare } from 'bcrypt';
import { errorMessage } from '@/common/messages';
import { VerificationService } from '@/verification/verification.service';
import { MailerService } from '@/mailer/mailer.service';
import { signupOtpMailTemplate } from '@/template/email.template';
import { VerifyUserDto } from '@/users/dto/verify-user.dto';
import { SendVerificationDto } from '@/users/dto/send-verification.dto';
import { LoggerService } from '@/logger/logger.service';
import { UpdateUserDto } from '@/users/dto/update-user.dto';
import { UpdatePasswordDto } from '@/users/dto/update-password.dto';
@Injectable()
export class UsersService {
	constructor(
		private readonly logger: LoggerService,
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private otpVerificationService: VerificationService,
		private emailService: MailerService,
	) {}
	async create(createUserDto: CreateUserDto): Promise<User> {
		const userExists = await this.userRepository.findOneBy({ email: createUserDto.email });
		if (userExists) {
			throw new BadRequestException(errorMessage.userAlreadyExists);
		}
		const passwordHash = await hash(createUserDto.password, env.SALT_ROUND);
		const user = { ...createUserDto, password_hash: passwordHash };
		const createdUser = await this.userRepository.save(user);
		if (!createdUser) {
			throw new TypeORMError(errorMessage.userCreationFailure);
		}
		this.logger.log(`New user ${createUserDto.name} created`);
		await this.sendEmailVerification({ email: user.email });
		return createdUser as User;
	}

	async findUser(where: Partial<Pick<User, 'id' | 'email'>>): Promise<User> {
		const user = await this.userRepository.findOne({
			where,
			select: {
				deleted_at: false,
			},
		});
		if (!user) {
			throw new NotFoundException(errorMessage.userNotFound);
		}
		return user;
	}

	async updateProfile(id: string, { name, email }: UpdateUserDto): Promise<Omit<User, 'password_hash'>> {
		const user = this.excludePasswordHash(await this.findUser({ id }));
		const updates: Partial<User> = {};
		if (name) {
			updates.name = name;
			this.logger.log(`User ${user.id} name updated to ${name}`);
		}
		if (email && email !== user.email) {
			const emailExists = await this.userRepository.findOneBy({ email });
			if (emailExists) {
				throw new BadRequestException(errorMessage.userAlreadyExists);
			}
			updates.email = email;
			updates.verified_at = null;
			this.logger.log(`User ${user.id} email updated to ${email}`);
		}
		if (Object.keys(updates).length === 0) {
			throw new BadRequestException(errorMessage.noUpdateProvided);
		}
		const update = await this.userRepository.update(user.id, { ...updates });
		if (!update) {
			throw new TypeORMError('failed to update user');
		}
		return { ...user, ...updates };
	}

	async updatePassword(id: string, { currentPassword, newPassword }: UpdatePasswordDto): Promise<void> {
		const user = await this.findUser({ id });
		const isPasswordValid = await compare(currentPassword, user.password_hash);
		if (!isPasswordValid) {
			throw new UnauthorizedException(errorMessage.invalidCurrentPassword);
		}
		const isNewPasswordSameAsCurrent = await compare(newPassword, user.password_hash);
		if (isNewPasswordSameAsCurrent) {
			throw new BadRequestException(errorMessage.samePasswords);
		}
		const newPasswordHash = await hash(newPassword, env.SALT_ROUND);
		await this.userRepository.update(user.id, { password_hash: newPasswordHash });
		this.logger.log(`User ${id} password updated`);
	}

	async sendEmailVerification({ email }: SendVerificationDto): Promise<void> {
		const user = this.excludePasswordHash(await this.findUser({ email }));
		if (user.verified_at) {
			throw new UnprocessableEntityException(errorMessage.userAlreadyVerified);
		}
		const otp = await this.otpVerificationService.createOtp(user.id);
		await this.emailService.sendEmail({
			subject: signupOtpMailTemplate.subject,
			to: [{ name: user.name, address: user.email }],
			html: signupOtpMailTemplate.body(otp, user.name),
		});
	}

	async verifyEmail({ email, otp }: VerifyUserDto): Promise<Omit<User, 'password_hash'>> {
		const user = this.excludePasswordHash(await this.findUser({ email }));
		if (user.verified_at) {
			throw new UnprocessableEntityException(errorMessage.userAlreadyVerified);
		}
		const isVerifiedSuccessfully = await this.otpVerificationService.validateThenRemoveOtp(user.id, otp);
		if (!isVerifiedSuccessfully) {
			throw new UnprocessableEntityException(errorMessage.userVerificationFailed);
		}
		user.verified_at = new Date();
		await this.userRepository.save(user);
		this.logger.log(`${email} verified successfully.`);
		return user;
	}

	excludePasswordHash(userObj: User): Omit<User, 'password_hash'> {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password_hash, ...rest } = userObj;
		return rest;
	}
}
