export const successMessage = {
	userCreated: 'User has been created successfully',
	userFetched: 'User has been fetched successfully',
	userVerified: 'User has been verified successfully',
	verificationEmailSent: 'Verification Email has been sent successfully',
};

export const errorMessage = {
	invalidOrExpiredOtp: 'Invalid or expired OTP',
	userAlreadyVerified: 'User is already verified',
	userVerificationFailed: 'Failed to verify user',
	userNotFound: 'User not found',
	userAlreadyExists: 'User with that email already exists',
	userCreationFailure: 'User not created',
	invalidCredentials: 'Invalid Credentials. Please check your credentials',
	notVerified: 'User not verified. Please verify your account first',
	tokenMissing: 'Authentication token missing. Please make sure you are logged in',
	minLengthValidation: 'Must be at least 5 characters long',
	maxLengthValidation: 'Must less than 15 characters',
	authenticationFailed: 'Could not authenticate user. Has the session expired?',
};
