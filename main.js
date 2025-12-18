import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { getActionDefinitions } from './actions.js'
import { getPresetDefinitions } from './presets.js'
import { getFeedbackDefinitions } from './feedbacks.js'

class CronosDownTCP extends InstanceBase {
	async init(config) {
		this.config = config

		// Load Actions, Presets and Feedbacks
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
	// TCP SOCKET
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
				})
			})

			this.socket.on('data', (data) => {
				const message = data.toString('utf8')

				// Handles double packets and extra characters
				const clean = message.replace(/\0/g, "").replace(/\r/g, "").replace(/\n/g, "").trim()

				const params = new URLSearchParams(clean)



				const hours = params.get('hours')
				const minutes = params.get('minutes')
				const seconds = params.get('seconds')
				const time = params.get('time')

				// -------------------------
				// RECEIVES TIME FROM SERVER
				// -------------------------
				if (hours && minutes && seconds && time) {

					const hr = parseInt(String(hours).trim()) || 0
					const min = parseInt(String(minutes).trim()) || 0
					const sec = parseInt(String(seconds).trim()) || 0

					this.setVariableValues({
						timer_hours: String(hr).padStart(2, '0'),
						timer_minutes: String(min).padStart(2, '0'),
						timer_seconds: String(sec).padStart(2, '0'),

						// FULL TIMER ALREADY FORMATTED
						timer: `${String(hr)}:${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`,
					})



					// VERY IMPORTANT !!!
					this.checkFeedbacks()
					return
				}


				// -------------------------------
				// RECEIVES PRESETS (item1…item20)
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
				}
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			})
		}
		else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}

	// ---------------------------------------------------------
	// VARIABLES
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

		// Initial values (not used, only placeholder)
		const now = new Date()
		const hours = now.getHours().toString()
		const minutes = now.getMinutes().toString()
		const seconds = now.getSeconds().toString()

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
