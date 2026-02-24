import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import * as resources from './resources';

export class Payroll implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BaseVN - App Payroll',
		name: 'payroll',
		icon: 'file:../../icons/payroll.svg',
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with BaseVN Payroll API',
		defaults: {
			name: 'BaseVN - App Payroll',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'payrollApi',
				required: true,
			},
		],
		properties: [
			...resources.description,
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['cycle'],
					},
				},
				options: [
					{
						name: 'List Cycles',
						value: 'list',
						description: 'Retrieve payroll cycles',
						action: 'List cycles',
					},
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['payroll'],
					},
				},
				options: [
					{
						name: 'List Payrolls',
						value: 'list',
						description: 'Retrieve payroll definitions within a cycle',
						action: 'List payrolls',
					},
					{
						name: 'Push Data',
						value: 'pushData',
						description: 'Push payroll data to a specific payroll',
						action: 'Push data to payroll',
					},
				],
				default: 'list',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['record'],
					},
				},
				options: [
					{
						name: 'List Records',
						value: 'list',
						description: 'Retrieve employee-level payroll records',
						action: 'List records',
					},
				],
				default: 'list',
			},
			...resources.cycle.description,
			...resources.payroll.description,
			...resources.record.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let responseData;
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'cycle') {
					if (operation === 'list') {
						responseData = await resources.cycle.list.execute.call(this, i);
					}
				} else if (resource === 'payroll') {
					if (operation === 'list') {
						responseData = await resources.payroll.list.execute.call(this, i);
					} else if (operation === 'pushData') {
						responseData = await resources.payroll.pushData.execute.call(this, i);
					}
				} else if (resource === 'record') {
					if (operation === 'list') {
						responseData = await resources.record.list.execute.call(this, i);
					}
				}

				if (responseData) {
					const executionData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray(responseData),
						{ itemData: { item: i } },
					);

					returnData.push(...executionData);
				}
			} catch (error: unknown) {
				if (this.continueOnFail()) {
					const message = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({ json: { error: message } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
