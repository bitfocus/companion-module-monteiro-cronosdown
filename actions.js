export function getActionDefinitions(self) {

	const actions = {}
	// Helper function to create simple command actions
	const createSimpleCommandAction = (name, command) => ({
		name: `${name}`,
		options: [],
		callback: async () => {
			const cmd = command
			const sendBuf = Buffer.from(cmd, 'latin1')

			self.log('debug', `sending to ${self.config.host}: ${sendBuf.toString()}`)

			if (self.socket !== undefined && self.socket.isConnected) {
				self.socket.send(sendBuf)
			} else {
				self.log('debug', 'Socket not connected :(')
			}
		},
	})

	// Creating simple command actions
	const simpleCommands = {
		ESC: 'esc',
		NEXT: 'next',
		PREVIOUS: 'previous',
		FECHAR_PPT: 'pptexit',
		FECHAR_VIDEO: 'videoexit',
		START: 'start',
		STOP: 'stop',
		DEFINE: 'define',
		RESET: 'reset',
		SET1: 'set01',
        SET5: 'set05',
        SET15: 'set15',
        SET30: 'set30',
        SET45: 'set45',
        SET60: 'set60',
		addMinute: 'addMinute',
		addFiveMinutes: 'addFiveMinutes',
		subtractMinute: 'subtractMinute',
		subtractFiveMinutes: 'subtractFiveMinutes',
		addHour: 'addHour',
		subtractHour: 'subtractHour',
		addMin: 'addMin',
		subtractMin: 'subtractMin',
		AA: 'AA',
		aa: 'aa',
		BB: 'BB',
		bb: 'bb'

	}

	for (let i = 1; i <= 20; i++) {
		const videoCommand = `PRESET${i.toString().padStart(2, '0')}`;
		simpleCommands[videoCommand] = videoCommand.toLowerCase();
	}

	for (const [name, command] of Object.entries(simpleCommands)) {
		actions[name] = createSimpleCommandAction(name, command)
	}

	return actions
}
