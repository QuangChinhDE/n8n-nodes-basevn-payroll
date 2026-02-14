import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { payrollApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['cycle'],
				operation: ['list'],
			},
		},
		default: 0,
		description: 'Page index (start from 0)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['cycle'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Report Month',
				name: 'report_month',
				type: 'number',
				default: 0,
				description: 'Timestamp of 1st day of month (00:00 GMT+7)',
			},
			{
				displayName: 'Report Year',
				name: 'report_year',
				type: 'number',
				default: 0,
			},
			{
				displayName: 'Updated From',
				name: 'updated_from',
				type: 'number',
				default: 0,
				description: 'Updated timestamp from',
			},
			{
				displayName: 'Updated To',
				name: 'updated_to',
				type: 'number',
				default: 0,
				description: 'Updated timestamp to',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const page = this.getNodeParameter('page', index, 0) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body = cleanBody({
		page,
		...additionalFields,
	});

	const response = await payrollApiRequest.call(this, 'POST', '/cycle/list', body);
	const data = processResponse(response);

	return data.map((item) => ({ json: item }));
}
