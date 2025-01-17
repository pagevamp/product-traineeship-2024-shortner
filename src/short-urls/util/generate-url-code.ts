import { customAlphabet } from 'nanoid';
export const generateUrlCode = (): string => {
	const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6);
	return nanoid();
};
