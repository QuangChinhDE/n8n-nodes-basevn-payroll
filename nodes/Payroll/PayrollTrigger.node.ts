import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';

export class PayrollTrigger implements INodeType {
	usableAsTool = true;

	description: INodeTypeDescription = {
		displayName: 'BaseVN - App Payroll Trigger',
		name: 'payrollTrigger',
		icon: 'file:../../icons/payroll.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when BaseVN Payroll webhook events occur',
		defaults: {
			name: 'BaseVN Payroll Trigger',
		},
		inputs: [],
		outputs: ['main'],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '={{$parameter["path"]}}',
			},
		],
		properties: [
			{
				displayName: 'Webhook Path',
				name: 'path',
				type: 'string',
				default: 'webhook',
				required: true,
				placeholder: 'webhook',
				description: 'The path for the webhook URL. Leave as default or customize it.',
			},
			{
				displayName: 'Response Selector',
				name: 'responseSelector',
				type: 'options',
				options: [
					{
						name: 'Full Payload',
						value: '',
						description: 'Return complete webhook payload',
					},
					{
						name: 'Body Only',
						value: 'body',
						description: 'Return only the body data',
					},
					{
						name: 'Payroll Info',
						value: 'payrollInfo',
						description: 'Return simplified payroll information',
					},
				],
				default: 'body',
				description: 'Select which data to return from webhook',
			},
		],
		usableAsTool: true,
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const responseSelector = this.getNodeParameter('responseSelector', '') as string;

		// Process response based on selector
		let returnData: IDataObject = bodyData;

		if (responseSelector === 'payrollInfo') {
			// Return simplified payroll information
			returnData = {
				id: bodyData.id,
				employee_id: bodyData.employee_id,
				employee_name: bodyData.employee_name,
				period: bodyData.period,
				period_from: bodyData.period_from,
				period_to: bodyData.period_to,
				salary_base: bodyData.salary_base,
				salary_net: bodyData.salary_net,
				salary_gross: bodyData.salary_gross,
				allowances: bodyData.allowances,
				deductions: bodyData.deductions,
				bonus: bodyData.bonus,
				tax: bodyData.tax,
				insurance: bodyData.insurance,
				status: bodyData.status,
				payment_date: bodyData.payment_date,
				created_at: bodyData.created_at,
				updated_at: bodyData.updated_at,
				link: bodyData.link,
			};
		} else if (responseSelector === '') {
			// Return full payload including headers
			const headerData = this.getHeaderData();
			returnData = {
				headers: headerData,
				body: bodyData,
			};
		}
		// else: Return body only (default) - returnData is already bodyData

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
