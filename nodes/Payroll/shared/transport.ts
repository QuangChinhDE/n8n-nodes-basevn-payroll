import type { IExecuteFunctions, IHttpRequestMethods, IDataObject } from 'n8n-workflow';

export async function payrollApiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
): Promise<IDataObject> {
	const credentials = await this.getCredentials('payrollApi');
	const domain = credentials.domain as string;
	const accessToken = credentials.accessToken as string;

	const requestBody = {
		access_token_v2: accessToken,
		...body,
	};

	const options = {
		method,
		url: `https://payroll.${domain}/extapi/v1${endpoint}`,
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: requestBody,
	};

	return await this.helpers.httpRequest(options);
}
