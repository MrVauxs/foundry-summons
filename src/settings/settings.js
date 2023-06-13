import { TJSGameSettings } from '@typhonjs-fvtt/svelte-standard/store';
import Svelttings from './settings.svelte';
import { moduleID } from '../utils';

export const gameSettings = new TJSGameSettings(moduleID);

Hooks.once('ready', () => {
	gameSettings.register({
		namespace: moduleID,
		key: 'debug',
		options: {
			scope: 'world',
			config: true,
			name: 'Debug Mode',
			type: Boolean,
			default: false,
		},
	});

	gameSettings.register({
		namespace: moduleID,
		key: 'blankNPC',
		options: {
			scope: 'world',
			config: false,
			type: Array,
			default: [],
		},
	});

	gameSettings.register({
		namespace: moduleID,
		key: 'hiddenFolder',
		options: {
			scope: 'world',
			config: false,
			type: String,
			default: '',
		},
	});

	gameSettings.register({
		namespace: moduleID,
		key: 'sources',
		options: {
			scope: 'world',
			config: false,
			type: Array,
			default: 'none',
		},
	});
});

Hooks.once('ready', () => {
	if (game.settings.get(moduleID, 'sources') === 'none') {
		switch (game.system.id) {
			case 'dnd5e':
				game.settings.set(moduleID, 'sources', ['PHB']);
				break;
			case 'pf2e':
				game.settings.set(moduleID, 'sources', ['CompendiumBrowser']);
				break;
			default:
				game.settings.set(moduleID, 'sources', ['']);
				break;
		}
	}
});

window.foundrySummons = window.foundrySummons || {};
window.foundrySummons.gameSettings = gameSettings;

Hooks.on('renderSettingsConfig', (app, html) => {
	const target = html[0].querySelectorAll(`[data-category="${moduleID}"]`)[0];
	const anchor = target.getElementsByClassName('form-group')[0];
	new Svelttings({ target, anchor, props: { gameSettings } });
});
