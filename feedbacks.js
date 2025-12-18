export function getFeedbackDefinitions(self) {
	return {

		// Time greater than 1 minute — GREEN
		timer_green: {
			type: 'boolean',
			name: 'Time greater than 1 min (Green)',
			description: 'Turns green while the total time is greater than 60 seconds.',
			options: [],
			callback: () => {
				const min = parseInt(self.getVariableValue('timer_minutes') || 0)
				const sec = parseInt(self.getVariableValue('timer_seconds') || 0)
				const total = min * 60 + sec
				return total > 60
			},
			style: {
				bgcolor: 0x00ff00,
				color: 0x000000,
			},
		},

		// Between 1 min and 30 seconds — YELLOW
		timer_yellow: {
			type: 'boolean',
			name: 'Time between 30s and 1 min (Yellow)',
			description: 'Turns yellow while it is between 60s and 31s.',
			options: [],
			callback: () => {
				const min = parseInt(self.getVariableValue('timer_minutes') || 0)
				const sec = parseInt(self.getVariableValue('timer_seconds') || 0)
				const total = min * 60 + sec
				return total <= 60 && total > 30
			},
			style: {
				bgcolor: 0xffff00,
				color: 0x000000,
			},
		},

		// Below 30 seconds — RED
		timer_red: {
			type: 'boolean',
			name: 'Time less than or equal to 30s (Red)',
			description: 'Turns red when the total time is 30 seconds or less.',
			options: [],
			callback: () => {
				const min = parseInt(self.getVariableValue('timer_minutes') || 0)
				const sec = parseInt(self.getVariableValue('timer_seconds') || 0)
				const total = min * 60 + sec
				return total <= 30
			},
			style: {
				bgcolor: 0xff0000,
				color: 0xffffff,
			},
		},
	}
}
