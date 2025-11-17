import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'
import { getFeedbackDefinitions } from './feedbacks.js'

class CronosDownTCP extends InstanceBase {
	async init(config) {
		this.config = config

		// Load Actions, Presets e Feedbacks
		this.setActionDefinitions(getActionDefinitions(this))
		this.setPresetDefinitions(getPresetDefinitions())
		this.setFeedbackDefinitions(getFeedbackDefinitions(this))

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

	// ---------------------------------------------------------
	// SOCKET TCP
	// ---------------------------------------------------------
	init_tcp() {
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {

			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
				this.socket.send('VERSION\r\n').catch((e) => {
					this.log('error', `Socket error: ${e}`)
				})
			})

			this.socket.on('data', (data) => {
				const message = data.toString('utf8')

				// Trata pacotes duplos e caracteres extras
				const clean = message.replace(/\0/g, "").replace(/\r/g, "").replace(/\n/g, "").trim()

				const params = new URLSearchParams(clean)



				const hours = params.get('hours')
				const minutes = params.get('minutes')
				const seconds = params.get('seconds')
				const time = params.get('time')

				// -------------------------
				// RECEBE TEMPO DO SERVIDOR
				// -------------------------
				if (hours && minutes && seconds && time) {

					const hr = parseInt(String(hours).trim()) || 0
					const min = parseInt(String(minutes).trim()) || 0
					const sec = parseInt(String(seconds).trim()) || 0

					this.setVariableValues({
						timer_hours: String(hr).padStart(2, '0'),
						timer_minutes: String(min).padStart(2, '0'),
						timer_seconds: String(sec).padStart(2, '0'),

						// TIMER COMPLETO JÁ FORMATADO
						timer: `${String(hr)}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`,
					})



					// MUITO IMPORTANTE !!!!
					this.checkFeedbacks()


					this.log('info', `Received time: ${hr}:${min}:${sec}`)
					return
				}


				// -------------------------------
				// RECEBE PRESETS (item1…item20)
				// -------------------------------
				const itemValues = {}

				for (let i = 1; i <= 20; i++) {
					const itemValue = params.get(`item${i}`)
					if (itemValue !== null) {
						itemValues[`item${i}`] = itemValue
					}
				}

				if (Object.keys(itemValues).length > 0) {
					this.setVariableValues(itemValues)
					this.checkFeedbacks()

					this.log('info', `Received items: ${Object.values(itemValues).join(', ')}`)
				}
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})
		}
		else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	// ---------------------------------------------------------
	// VARIÁVEIS
	// ---------------------------------------------------------
	init_tcp_variables() {
		const variables = [
			{ name: 'Timer', variableId: 'timer' },
			{ name: 'Timer Hours', variableId: 'timer_hours' },
			{ name: 'Timer Minutes', variableId: 'timer_minutes' },
			{ name: 'Timer Seconds', variableId: 'timer_seconds' },
		]


		for (let i = 1; i <= 20; i++) {
			variables.push({ name: `Item ${i}`, variableId: `item${i}` })
		}

		this.setVariableDefinitions(variables)

		// Valores iniciais (não usados, apenas placeholder)
		const now = new Date()
		const hours = now.getHours().toString().padStart(2, '0')
		const minutes = now.getMinutes().toString().padStart(2, '0')
		const seconds = now.getSeconds().toString().padStart(2, '0')

		const initialValues = {
			timer: `${hours}:${minutes}:${seconds}`,
			timer_hours: parseInt(hours),
			timer_minutes: parseInt(minutes),
			timer_seconds: parseInt(seconds),
		}

		for (let i = 1; i <= 20; i++) {
			initialValues[`item${i}`] = `PRESET\n${i}`
		}

		this.setVariableValues(initialValues)
	}
}

runEntrypoint(CronosDownTCP, [])
