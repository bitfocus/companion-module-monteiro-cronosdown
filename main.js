import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'

class CronosDownTCP extends InstanceBase {
	async init(config) {
		this.config = config

		this.setActionDefinitions(getActionDefinitions(this))
		this.setPresetDefinitions(getPresetDefinitions())

		await this.configUpdated(config)
		this.init_tcp_variables()
	}

	async configUpdated(config) {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.config = config
		this.init_tcp()
		this.init_tcp_variables()
		
	}

	async destroy() {
		if (this.socket) {
			this.socket.destroy()
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	getConfigFields() {
		return ConfigFields
	}

	init_tcp() {
		if (this.socket) {
			this.socket.destroy();
			delete this.socket;
		}
	
		this.updateStatus(InstanceStatus.Connecting);
	
		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port); 
	
			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message);
				this.socket.send('VERSION\r\n').catch((e) => {
					this.log('error', `Socket error: ${e}`);
				});
			});
	
			this.socket.on('data', (data) => {
				const message = data.toString('utf8');
				const params = new URLSearchParams(message);
				const hours = params.get('hours');
				const minutes = params.get('minutes');
				const seconds = params.get('seconds');
				const time = params.get('time');
	
				if (hours && minutes && seconds && time) {
					this.setVariableValues({
						timer_hours: hours,
						timer_minutes: minutes,
						timer_seconds: seconds,
						timer: time,
					});
					this.log('info', `Received time: ${time} (H: ${hours}, M: ${minutes}, S: ${seconds})`);
				} else {
					const itemValues = {};
					for (let i = 1; i <= 20; i++) {
						const itemValue = params.get(`item${i}`);
						if (itemValue !== null) {
							itemValues[`item${i}`] = itemValue;
						}
					}
	
					this.setVariableValues(itemValues);
					const receivedItems = Object.values(itemValues).filter(value => value !== '');
					this.log('info', `Received items: ${receivedItems.join(', ')}`);
				}
			});
	
			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message);
				this.log('error', 'Network error: ' + err.message);
			});
		} else {
			this.updateStatus(InstanceStatus.BadConfig);
		}
	}
	
	init_tcp_variables() {
		const variables = [
			{ name: 'Timer', variableId: 'timer' },
			{ name: 'Timer Hours', variableId: 'timer_hours' },
			{ name: 'Timer Minutes', variableId: 'timer_minutes' },
			{ name: 'Timer Seconds', variableId: 'timer_seconds' },

		];

		for (let i = 1; i <= 20; i++) {
			variables.push({ name: `Item ${i}`, variableId: `item${i}` });
		}

		this.setVariableDefinitions(variables);

		const now = new Date();
		const hours = now.getHours().toString().padStart(2, '0');
		const minutes = now.getMinutes().toString().padStart(2, '0');
		const seconds = now.getSeconds().toString().padStart(2, '0');

		const initialValues = {
			timer: `${hours}:${minutes}:${seconds}`,
			timer_hours: hours,
			timer_minutes: minutes,
			timer_seconds: seconds,

		};

		for (let i = 1; i <= 20; i++) {
			initialValues[`item${i}`] = `PRESET\n${i}`;
		}

		this.setVariableValues(initialValues);
	}
}

runEntrypoint(CronosDownTCP, [])
