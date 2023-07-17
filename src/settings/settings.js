import { TJSGameSettings } from '@typhonjs-fvtt/svelte-standard/store';
import Svelttings from './settings.svelte';
import { debug, moduleID } from '../utils';
import { createBlanks } from './templateActors/index.js';
import { registerSystemSettings, selectDefaultSources, setDefaultIndexFields } from './systemSpecific';
import loadPacks from '../summon/menu/loadPacks';

export const gameSettings = new TJSGameSettings(moduleID);

Hooks.once('init', () => {
	gameSettings.register({
		namespace: moduleID,
		key: 'debug',
		options: {
			scope: 'world',
			config: true,
			name: 'foundry-summons.settings.debug.title',
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

	gameSettings.register({
		namespace: moduleID,
		key: 'additionalIndexFields',
		options: {
			scope: 'world',
			config: false,
			type: Array,
			default: [],
		},
	});

	registerSystemSettings();
});

Hooks.once('ready', () => {
	if (game.settings.get(moduleID, 'sources').includes('none')) {
		console.log('Foundry Summons | Selecting default sources');
		selectDefaultSources();
	}

	setDefaultIndexFields();
	createBlanks();

	gameSettings.getStore('sources').subscribe(() => {
		if (foundrySummons?.index?.length) {
			console.log('Foundry Summons | Updating Index');
			loadPacks(true);
		}
	});
});

Hooks.on('renderSettingsConfig', (app, html) => {
	const target = html[0].querySelectorAll(`[data-category="${moduleID}"]`)[0];
	const anchor = target.getElementsByClassName('form-group')[0];
	new Svelttings({ target, anchor, props: { gameSettings } });
});

Hooks.on('renderActorDirectory', (app, html) => {
	if (!game.settings.get(moduleID, 'debug')) {
		const folder = html.find(`.folder[data-folder-id="${game.settings.get(moduleID, 'hiddenFolder')}"]`);
		folder.remove();
	}
});

window.foundrySummons = window.foundrySummons || {};
window.foundrySummons.gameSettings = gameSettings;
