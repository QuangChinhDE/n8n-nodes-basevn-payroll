import type { IDataObject } from 'n8n-workflow';

export function cleanBody(body: IDataObject): IDataObject {
	const cleaned: IDataObject = {};
	for (const key in body) {
		if (body[key] !== undefined && body[key] !== null && body[key] !== '') {
			cleaned[key] = body[key];
		}
	}
	return cleaned;
}

export function processResponse(response: IDataObject): IDataObject[] {
	if (response.cycles) {
		return response.cycles as IDataObject[];
	}
	if (response.payrolls) {
		return response.payrolls as IDataObject[];
	}
	if (response.records) {
		return response.records as IDataObject[];
	}
	return [response];
}
