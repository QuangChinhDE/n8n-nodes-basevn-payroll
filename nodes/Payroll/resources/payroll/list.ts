import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { payrollApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Cycle ID',
		name: 'cycleId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['payroll'],
				operation: ['list'],
			},
		},
		default: 0,
		description: 'Payroll cycle ID',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['payroll'],
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
				resource: ['payroll'],
				operation: ['list'],
			},
		},
		options: [
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
	const cycleId = this.getNodeParameter('cycleId', index) as number;
	const page = this.getNodeParameter('page', index, 0) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body = cleanBody({
		cycle_id: cycleId,
		page,
		...additionalFields,
	});

	const response = await payrollApiRequest.call(this, 'POST', '/payroll/list', body);
	const data = processResponse(response);

	return data.map((item) => ({ json: item }));
}
