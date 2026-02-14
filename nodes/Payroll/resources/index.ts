import type { INodeProperties } from 'n8n-workflow';

export * as cycle from './cycle';
export * as payroll from './payroll';
export * as record from './record';

const resourceDescription: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	options: [
		{
			name: 'Cycle',
			value: 'cycle',
		},
		{
			name: 'Payroll',
			value: 'payroll',
		},
		{
			name: 'Record',
			value: 'record',
		},
	],
	default: 'cycle',
};

export const description: INodeProperties[] = [resourceDescription];
