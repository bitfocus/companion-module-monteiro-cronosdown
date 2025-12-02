export function getPresetDefinitions() {
	const presets = {}

	// ---------------------------------------------------------
	// Base function to create presets
	// ---------------------------------------------------------
	function createPreset(id, category, name, text, color, bgcolor, actionId, size = 24) {
		presets[`preset_${id}`] = {
			type: 'button',
			category: category,
			name: name,
			style: {
				text,
				size,
				color: Number(color),
				bgcolor: Number(bgcolor),

				// allows feedback to change color (ESSENTIAL)
				bgcolorVar: true,
				colorVar: true,

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

	// ---------------------------------------------------------
	// Function: apply default timer feedback automatically
	// ---------------------------------------------------------
	function applyTimerFeedback(presetName) {
		if (!presets[presetName]) return

		presets[presetName].feedbacks = [
			{
				feedbackId: 'timer_green',
				style: { bgcolor: 0x00ff00, color: 0x000000 },
			},
			{
				feedbackId: 'timer_yellow',
				style: { bgcolor: 0xffff00, color: 0x000000 },
			},
			{
				feedbackId: 'timer_red',
				style: { bgcolor: 0xff0000, color: 0xffffff },
			},
		]
	}
	// ---------------------------------------------------------
	// Control Buttons
	// ---------------------------------------------------------
	const controlPresets = [
		{ id: 'start', name: 'Start Timer', text: 'START', color: 0xffffff, bgcolor: 0x00aa00, actionId: 'START' },
		{ id: 'stop', name: 'Stop Timer', text: 'STOP', color: 0xffffff, bgcolor: 0xaa0000, actionId: 'STOP' },
		{ id: 'reset', name: 'Reset Timer', text: 'RESET', color: 0xffffff, bgcolor: 0x555555, actionId: 'RESET' },
		{ id: 'define', name: 'Set Timer', text: 'DEFINE', color: 0xffffff, bgcolor: 0x004400, actionId: 'DEFINE' },
	]

	controlPresets.forEach((p) =>
		createPreset(p.id, 'Control', p.name, p.text, p.color, p.bgcolor, p.actionId)
	)
	// ---------------------------------------------------------
	// Display Buttons
	// ---------------------------------------------------------
	const displayPresets = [
		{ id: 'hour', name: 'HOUR', text: '$(Cronos:timer_hours)', bgcolor: 0x555555 },
		{ id: 'minute', name: 'MINUTE', text: '$(Cronos:timer_minutes)', bgcolor: 0x555555 },
		{ id: 'second', name: 'SECOND', text: '$(Cronos:timer_seconds)', bgcolor: 0x555555 },
		{ id: 'timer', name: 'TIMER', text: '$(Cronos:timer)', bgcolor: 0x444444 },
	]

	displayPresets.forEach((p) =>
		createPreset(p.id, 'Display', p.name, p.text, 0xffffff, p.bgcolor)
	)

	// ---------------------------------------------------------
	// Apply automatic feedback to buttons that display time
	// ---------------------------------------------------------
	applyTimerFeedback('preset_timer')
	applyTimerFeedback('preset_hour')
	applyTimerFeedback('preset_minute')
	applyTimerFeedback('preset_second')

	// ---------------------------------------------------------
	// Fixed Time Buttons (SET)
	// ---------------------------------------------------------
	function addSetPreset(minutes) {
		createPreset(
			`set${minutes}`,
			'SET',
			`Set ${minutes} Minutes`,
			`SET\n${minutes} MIN`,
			0xffffff,
			0x00b4ff,
			`SET${minutes}`
		)
	}

	;[1, 5, 15, 30, 45, 60].forEach(addSetPreset)
	// ---------------------------------------------------------
	// Increment Adjustment Functions
	// ---------------------------------------------------------
	function addTimePreset(actionId, text, name) {
		createPreset(actionId, 'Function', name, text, 0xffffff, 0x000000, actionId)
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
	].forEach((p) => addTimePreset(p.id, p.text, p.name))

	// ---------------------------------------------------------
	// Presets 01–20 (Items)
	// ---------------------------------------------------------
	for (let i = 1; i <= 20; i++) {
		const id = i < 10 ? `0${i}` : i

		createPreset(
			`preset${id}`,
			'Preset',
			`Send PRESET${id} Command`,
			`$(Cronos:item${i})`,
			0xffffff,
			0x006600,
			`PRESET${id}`
		)
	}

	return presets
}
