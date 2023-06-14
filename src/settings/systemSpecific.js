import { gameSettings } from './settings.js';
import { moduleID } from '../utils';
export default function registerSystemSettings() {
	switch (game.system.id) {
		case 'pf2e': {
			gameSettings.register({
				namespace: moduleID,
				key: 'uncommonAllowance',
				options: {
					scope: 'world',
					config: false,
					type: Boolean,
					default: true,
				},
			});

			break;
		}
	}
}

