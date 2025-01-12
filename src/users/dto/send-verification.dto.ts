import { PickType } from '@nestjs/mapped-types';
import { VerifyUserDto } from '@/users/dto/verify-user.dto';

export class SendVerificationDto extends PickType(VerifyUserDto, ['email'] as const) {}
