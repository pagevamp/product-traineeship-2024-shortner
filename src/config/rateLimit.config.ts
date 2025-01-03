export const loginRateLimiter = {
	max: 2,
	windowMs: 15 * 60 * 1000,
};

export const otpRateLimiter = {
	windowMs: 5 * 60 * 1000,
	max: 10,
};

export const urlRateLimiter = {
	windowMs: 1 * 60,
	max: 5,
};
