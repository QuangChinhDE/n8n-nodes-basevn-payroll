import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
} from 'n8n-workflow';
import { payrollApiRequest } from '../../shared/transport';
import { cleanBody } from '../../shared/utils';

export const description: INodeProperties[] = [
	{
		displayName: 'Payroll ID',
		name: 'payrollId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['payroll'],
				operation: ['pushData'],
			},
		},
		default: 0,
		description: 'ID of the payroll to push data to',
	},
	{
		displayName: 'Data',
		name: 'data',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['payroll'],
				operation: ['pushData'],
			},
		},
		default: '',
		description: 'Base64 encoded JSON array of payroll data. Example: [{"employee_id":1192,"luong_cung":10000000}].',
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
				operation: ['pushData'],
			},
		},
		options: [
			{
				displayName: 'Source',
				name: 'source',
				type: 'string',
				default: 'base',
				description: 'Source of the data push',
			},
		],
	},
];

export async function execute(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const payrollId = this.getNodeParameter('payrollId', index) as number;
	const data = this.getNodeParameter('data', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;

	const body = cleanBody({
		payroll_id: payrollId,
		data,
		source: additionalFields.source || 'base',
	});

	const response = await payrollApiRequest.call(this, 'POST', '/payroll/push.data', body);
	
	return [{ json: response }];
}
