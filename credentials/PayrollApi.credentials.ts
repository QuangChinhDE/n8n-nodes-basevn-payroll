import type {
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

export class PayrollApi implements ICredentialType {
	name = 'payrollApi';

	displayName = 'BaseVN - App Payroll API';

	icon: Icon = 'file:../icons/payroll.svg';

	documentationUrl = 'https://payroll.base.vn';

	properties: INodeProperties[] = [
		{
			displayName: 'Domain',
			name: 'domain',
			type: 'string',
			default: '',
			placeholder: 'company.base.vn',
			required: true,
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '=https://payroll.{{$credentials.domain}}/extapi/v1',
			url: '/cycle/list',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: {
				access_token_v2: '={{$credentials.accessToken}}',
				page: 0,
			},
		},
	};
}
