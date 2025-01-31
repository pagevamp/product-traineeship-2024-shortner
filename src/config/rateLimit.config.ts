export const authRateLimiter = {
	max: 10,
	windowMs: 15 * 60 * 1000,
};

export const otpVerificationRateLimiter = {
	max: 10,
	windowMs: 5 * 60 * 1000,
};

export const urlRateLimiter = {
	max: 5,
	windowMs: 1 * 60,
};

export const testLimit = {
	max: 3,
	windowMs: 15 * 60 * 1000,
	isGlobal: true,
};
