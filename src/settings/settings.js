import { TJSGameSettings } from '@typhonjs-fvtt/svelte-standard/store';
import Svelttings from './settings.svelte';
import { debug, moduleID } from '../utils';
import { registerSystemSettings, selectDefaultSources, setDefaultIndexFields } from './systemSpecific';

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

	gameSettings.register({
		namespace: moduleID,
		key: 'onlyImages',
		options: {
			scope: 'world',
			config: false,
			type: Boolean,
			default: false,
		},
	});

	gameSettings.register({
		namespace: moduleID,
		key: 'autoAccept',
		options: {
			scope: 'world',
			config: false,
			type: Boolean,
			default: false,
		},
	});

	gameSettings.register({
		namespace: moduleID,
		key: 'indexFields',
		options: {
			scope: 'world',
			config: false,
			type: Array,
			default: 'none',
		},
	});

	registerSystemSettings();
});

Hooks.once('ready', () => {
	if (game.settings.get(moduleID, 'sources') === 'none') {
		selectDefaultSources();
	}

	if (game.settings.get(moduleID, 'indexFields') === 'none') {
		setDefaultIndexFields();
	}
});

window.foundrySummons = window.foundrySummons || {};
window.foundrySummons.gameSettings = gameSettings;

Hooks.on('renderSettingsConfig', (app, html) => {
	const target = html[0].querySelectorAll(`[data-category="${moduleID}"]`)[0];
	const anchor = target.getElementsByClassName('form-group')[0];
	new Svelttings({ target, anchor, props: { gameSettings } });
});
