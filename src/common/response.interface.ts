import { UrlAnalytics } from '@/url-analytics/entities/url-analytics.entity';

export interface SuccessResponse {
	status: number;
	message: string;
}

export interface GetMethodResponse extends SuccessResponse {
	data: object[];
}

export type TokenResponse = {
	accessToken: string;
} & SuccessResponse;

export type TemplateResponse = {
	statusCode: number;
	data: string;
};

export type QueryFilterInterface = {
	reports: UrlAnalytics[];
	numberOfHits?: number;
};
