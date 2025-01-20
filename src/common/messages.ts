export const successMessage = {
	userCreated: 'User has been created successfully',
	userFetched: 'User has been fetched successfully',
	userVerified: 'User has been verified successfully',
	verificationEmailSent: 'Verification Email has been sent successfully',
	loginSuccess: 'Login success',
	shortUrlCreated: 'Short URL created successfylly',
	noExpiredUrls: 'No short urls are expired.',
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
	currentDateValidation: 'Expiary Date must be greater than the current date and time',
	urlCreationFailure: 'Short URL not created',
	shortCodeGenerationFailed: 'Failed to generate unique URL code after maximum retries',
};
