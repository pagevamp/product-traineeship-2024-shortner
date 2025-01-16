export interface SuccessResponse {
	status: number;
	message: string;
}

export interface GetMethodResponse extends SuccessResponse {
	data: object[];
}

export type TokenResponse = {
	accessToken: string;
};
