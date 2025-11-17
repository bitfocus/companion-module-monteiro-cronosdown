export function getFeedbackDefinitions(self) {
	return {

		// Tempo maior que 1 minuto — VERDE
		timer_green: {
			type: 'boolean',
			name: 'Tempo maior que 1 min (Verde)',
			description: 'Fica verde enquanto o tempo total for maior que 60 segundos.',
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

		// Entre 1 min e 30 segundos — AMARELO
		timer_yellow: {
			type: 'boolean',
			name: 'Tempo entre 30s e 1 min (Amarelo)',
			description: 'Fica amarelo enquanto estiver entre 60s e 31s.',
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

		// Abaixo de 30 segundos — VERMELHO
		timer_red: {
			type: 'boolean',
			name: 'Tempo menor ou igual a 30s (Vermelho)',
			description: 'Fica vermelho quando o tempo total for 30 segundos ou menos.',
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
