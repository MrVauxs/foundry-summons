import { TJSGameSettings } from '@typhonjs-fvtt/svelte-standard/store';
import Svelttings from './settings.svelte';
import { debug, moduleID } from '../utils';
import registerSystemSettings from './systemSpecific';

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

	registerSystemSettings();
});

export function selectDefaultSources() {
	switch (game.system.id) {
		case 'dnd5e': {
			game.settings.set(moduleID, 'sources', ['PHB']);
			break;
		}
		case 'pf2e': {
			const array = game.packs.contents
				.filter((pack) => pack.metadata.type === 'Actor')
				.map((x) => x.metadata)
				.filter((x) =>
					Object.keys(game.pf2e.compendiumBrowser.settings.bestiary)
						.filter((key) => game.pf2e.compendiumBrowser.settings.bestiary[key].load)
						.includes(x.id)
				);

			game.settings.set(moduleID, 'sources', array);
			break;
		}
		default: {
			game.settings.set(moduleID, 'sources', ['']);
			break;
		}
	}
}

Hooks.once('ready', () => {
	if (game.settings.get(moduleID, 'sources') === 'none') {
		selectDefaultSources();
	}
});

window.foundrySummons = window.foundrySummons || {};
window.foundrySummons.gameSettings = gameSettings;

Hooks.on('renderSettingsConfig', (app, html) => {
	const target = html[0].querySelectorAll(`[data-category="${moduleID}"]`)[0];
	const anchor = target.getElementsByClassName('form-group')[0];
	new Svelttings({ target, anchor, props: { gameSettings } });
});
