import { Regex } from '@companion-module/base'

const REGEX_IP_OR_HOST =
	'/^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})$|^((([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]).)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9]))$/'

export const ConfigFields = [
	{
		type: 'static-text',
		id: 'info',
		label: 'Information',
		width: 12,
		value: `This software controls "CronosDown" by Monteiro, for use as a stopwatch.`,
	},
	{
		type: 'textinput',
		id: 'host',
		label: 'Target Host name or IP',
		default: '127.0.0.1',
		width: 8,
		regex: REGEX_IP_OR_HOST,
	},
	{
		type: 'textinput',
		id: 'port',
		label: 'Target Port',
		default: '7600',
		width: 4,
		regex: Regex.PORT,
	},
]
