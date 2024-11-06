export function getPresetDefinitions() {
	const presets = {}

	// Função para criar presets básicos com texto e ação customizados
	function createPreset(id, category, name, text, color, bgcolor, actionId, size = '18') {
		presets[`preset_${id}`] = {
			type: 'button',
			category: category,
			name: name,
			style: {
				text: text,
				size: size,
				color: color,
				bgcolor: bgcolor,
				show_topbar: false,
			},
			steps: [
				{
					down: actionId ? [{ actionId: actionId }] : [],
					up: [],
				},
			],
		}
	}

	// Presets de controle START, STOP, RESET, DEFINE
	const controlPresets = [
		{ id: 'start', name: 'Start Timer', text: 'START', color: '16777215', bgcolor: '43520', actionId: 'START' },
		{ id: 'stop', name: 'Stop Timer', text: 'STOP', color: '16777215', bgcolor: '9109504', actionId: 'STOP' },
		{ id: 'reset', name: 'Reset Timer', text: 'RESET', color: '0', bgcolor: '8421504', actionId: 'RESET' },
		{ id: 'define', name: 'Set Timer', text: 'DEFINE', color: '16777215', bgcolor: '43520', actionId: 'DEFINE' },
	]
	controlPresets.forEach(({ id, name, text, color, bgcolor, actionId }) =>
		createPreset(id, 'Control', name, text, color, bgcolor, actionId)
	)

	// Presets de exibição de tempo HOUR, MINUTE, SECOND, TIMER
	const displayPresets = [
		{ id: 'hour', name: 'HOUR', text: '$(Cronos:timer_hours)', bgcolor: '9109504' },
		{ id: 'minute', name: 'MINUTE', text: '$(Cronos:timer_minutes)', bgcolor: '9109504' },
		{ id: 'second', name: 'SECOND', text: '$(Cronos:timer_seconds)', bgcolor: '9109504' },
		{ id: 'timer', name: 'TIMER', text: '$(Cronos:timer)', bgcolor: '9109504' },
	]
	displayPresets.forEach(({ id, name, text, bgcolor }) => createPreset(id, 'Display', name, text, '16777215', bgcolor))

	// Função para adicionar presets SET de minutos
	function addSetPreset(minutes) {
		createPreset(
			`set${minutes}`,
			'SET',
			`Set ${minutes} Minutes`,
			`SET\n${minutes} MIN`,
			'16777215',
			'180',
			`SET${minutes}`
		)
	}
	;[1, 5, 15, 30, 45, 60].forEach(addSetPreset)

	// Função para adicionar presets de tempo personalizados
	function addTimePreset(actionId, text, name) {
		createPreset(actionId, 'Function', name, text, '16777215', '0', actionId)
	}
	;[
		{ id: 'addMinute', text: 'ADD\n1 MIN', name: 'Add 1 Minute' },
		{ id: 'addFiveMinutes', text: 'ADD\n5 MIN', name: 'Add 5 Minutes' },
		{ id: 'subtractMinute', text: 'SUB\n1 MIN', name: 'Subtract 1 Minute' },
		{ id: 'subtractFiveMinutes', text: 'SUB\n5 MIN', name: 'Subtract 5 Minutes' },
		{ id: 'AA', text: 'AA\nTimer', name: 'AA' },
		{ id: 'aa', text: 'aa\nTimer', name: 'aa' },
		{ id: 'BB', text: 'AA\nMsg', name: 'BB' },
		{ id: 'bb', text: 'aa\nMsg', name: 'bb' },
	].forEach(({ id, text, name }) => addTimePreset(id, text, name))

	// Presets de comando (PRESET01 a PRESET20)
	for (let i = 1; i <= 20; i++) {
		const id = i < 10 ? `0${i}` : i
		createPreset(
			`preset${id}`,
			'Preset',
			`Send PRESET${id} Command`,
			`$(Cronos:item${i})`,
			'16777215',
			'25600',
			`PRESET${id}`
		)
	}

	return presets
}
