import type { IDataObject, IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { payrollApiRequest } from '../../shared/transport';
import { cleanBody, processResponse } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Filter By',
		name: 'filterBy',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['record'],
				operation: ['list'],
			},
		},
		options: [
			{
				name: 'Cycle ID',
				value: 'cycle',
			},
			{
				name: 'Payroll ID',
				value: 'payroll',
			},
		],
		default: 'payroll',
		description: 'Filter records by cycle or payroll',
	},
	{
		displayName: 'Cycle ID',
		name: 'cycleId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['record'],
				operation: ['list'],
				filterBy: ['cycle'],
			},
		},
		default: 0,
		description: 'Payroll cycle ID',
	},
	{
		displayName: 'Payroll ID',
		name: 'payrollId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['record'],
				operation: ['list'],
				filterBy: ['payroll'],
			},
		},
		default: 0,
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['record'],
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
				resource: ['record'],
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
	const filterBy = this.getNodeParameter('filterBy', index) as string;
	const page = this.getNodeParameter('page', index, 0) as number;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body: IDataObject = {
		page,
		...additionalFields,
	};

	if (filterBy === 'cycle') {
		const cycleId = this.getNodeParameter('cycleId', index) as number;
		body.cycle_id = cycleId;
	} else {
		const payrollId = this.getNodeParameter('payrollId', index) as number;
		body.payroll_id = payrollId;
	}

	const cleanedBody = cleanBody(body);
	const response = await payrollApiRequest.call(this, 'POST', '/record/list', cleanedBody);
	const data = processResponse(response);

	return data.map((item) => ({ json: item }));
}
