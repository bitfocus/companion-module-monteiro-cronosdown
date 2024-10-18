export function getPresetDefinitions() {
    const presets = {
        preset_start: {
            type: 'button',
            category: 'Control',
            name: 'Start Timer',
            style: {
                text: 'START',
                size: '18',
                color: '16777215',
                bgcolor: '43520',
                show_topbar: false
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'START',
                        },
                    ],
                    up: [],
                },
            ],
        },
        preset_stop: {
            type: 'button',
            category: 'Control',
            name: 'Stop Timer',
            style: {
                text: 'STOP',
                size: '18',
                color: '16777215',
                bgcolor: '9109504',
                show_topbar: false
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'STOP',
                        },
                    ],
                    up: [],
                },
            ],
        },
        preset_reset: {
            type: 'button',
            category: 'Control',
            name: 'Reset Timer',
            style: {
                text: 'RESET',
                size: '18',
                color: '0',
                bgcolor: '8421504',
                show_topbar: false
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'RESET',
                        },
                    ],
                    up: [],
                },
            ],
        },
        preset_define: {
            type: 'button',
            category: 'Control',
            name: 'Set Timer',
            style: {
                text: 'DEFINE',
                size: '18',
                color: '16777215',
                bgcolor: '43520',
                show_topbar: false
            },
            steps: [
                {
                    down: [
                        {
                            actionId: 'DEFINE',
                        },
                    ],
                    up: [],
                },
            ],
        },
        preset_hour: {
            type: 'button',
            category: 'Display',
            name: 'HOUR',
            style: {
                text: '$(Cronos:timer_hours)',
                size: 'AUTO',
                color: '16777215',
                bgcolor: '9109504',
                show_topbar: false
            },
            steps: [
                {
                    down: [],
                    up: [],
                },
            ],
        },
        preset_minute: {
            type: 'button',
            category: 'Display',
            name: 'MINUTE',
            style: {
                text: '$(Cronos:timer_minutes)',
                size: 'AUTO',
                color: '16777215',
                bgcolor: '9109504',
                show_topbar: false
            },
            steps: [
                {
                    down: [],
                    up: [],
                },
            ],
        },
        preset_second: {
            type: 'button',
            category: 'Display',
            name: 'SECOND',
            style: {
                text: '$(Cronos:timer_seconds)',
                size: 'AUTO',
                color: '16777215',
                bgcolor: '9109504',
                show_topbar: false
            },
            steps: [
                {
                    down: [],
                    up: [],
                },
            ],
        },
        preset_timer: {
            type: 'button',
            category: 'Display',
            name: 'TIMER',
            style: {
                text: '$(Cronos:timer)',
                size: 'AUTO',
                color: '16777215',
                bgcolor: '9109504',
                show_topbar: false
            },
            steps: [
                {
                    down: [],
                    up: [],
                },
            ],
        },


    };


    // Função auxiliar para adicionar presets SET
    function addSetPreset(minutes) {
        presets[`preset_set${minutes}`] = {
            type: 'button',
            category: 'SET',
            name: `Set ${minutes} Minutes`,
            style: {
                text: `SET\n${minutes} MIN`,
                size: '18',
                color: '16777215',
                bgcolor: '180',
                show_topbar: false
            },
            steps: [
                {
                    down: [
                        {
                            actionId: `SET${minutes}`,  // Ação identificada como SET
                            options: {
                                minutes: minutes,  // Opções específicas para o SET, como os minutos
                            },
                        },
                    ],
                    up: [],
                },
            ],
        };
    }

    // Adicionar presets SET
    addSetPreset(1);
    addSetPreset(5);
    addSetPreset(15);
    addSetPreset(30);
    addSetPreset(45);
    addSetPreset(60);


    // Adicionar presets de tempo
    addTimePreset('addMinute', 'ADD\n1 MIN', 'Add 1 Minute');
    addTimePreset('addFiveMinutes', 'ADD\n5 MIN', 'Add 5 Minutes');
    addTimePreset('subtractMinute', 'SUB\n1 MIN', 'Subtract 1 Minute');
    addTimePreset('subtractFiveMinutes', 'SUB\n5 MIN', 'Subtract 5 Minutes');
    addTimePreset('addHour', 'ADD\n1 HR', 'Add 1 Hour');
    addTimePreset('subtractHour', 'SUB\n1 HR', 'Subtract 1 Hour');
    addTimePreset('addMin', 'ADD\nMIN', 'Add Minute');
    addTimePreset('subtractMin', 'SUB\nMIN', 'Subtract Minute');
    addTimePreset('AA', 'AA\nTimer', 'AA');
    addTimePreset('aa', 'aa\nTimer', 'aa');
    addTimePreset('BB', 'AA\nMsg', 'BB');
    addTimePreset('bb', 'aa\nMsg', 'bb');

    // Função auxiliar para adicionar presets de tempo
    function addTimePreset(actionId, text, name) {
        presets[`preset_${actionId}`] = {
            type: 'button',
            category: 'Function',
            name: name,
            style: {
                text: text,
                size: '18',
                color: '16777215',
                bgcolor: '0',
                show_topbar: false
            },
            steps: [
                {
                    down: [
                        {
                            actionId: actionId,
                        },
                    ],
                    up: [],
                },
            ],
        };
    }

    
    // Gerar presets de comando para os presets 1 a 20
for (let i = 1; i <= 20; i++) {
    const paddedNumber = i < 10 ? `0${i}` : `${i}`; // Adiciona zero à esquerda para números de 1 a 9
    const actionId = `preset${paddedNumber}`;
    const pptCommand = `preset${paddedNumber}`;
    const variableName = `$(Cronos:item${i})`; // Nome da variável correspondente ao item
    
    presets[`preset_${actionId}`] = {
        type: 'button',
        category: 'Preset',
        name: `Send ${pptCommand.toUpperCase()} Command`,
        style: {
            text: variableName,
            size: '14',
            color: '16777215',
            bgcolor: '25600',
            show_topbar: false
        },
        steps: [
            {
                down: [
                    {
                        actionId: actionId,
                        options: {
                            presetId: i, // Identifica o número do preset
                        },
                    },
                ],
                up: [],
            },
        ],
    };
}
    return presets;
}
