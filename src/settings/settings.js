import { TJSGameSettings } from '@typhonjs-fvtt/svelte-standard/store';
import Svelttings from './settings.svelte';
import { moduleID } from '../utils';

export const gameSettings = new TJSGameSettings(moduleID);

Hooks.on('ready', () => {
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
});

Hooks.on('renderSettingsConfig', (app, html) => {
	const target = html[0].querySelectorAll(`[data-category="${moduleID}"]`)[0];
	const anchor = target.getElementsByClassName('form-group')[0];
	new Svelttings({ target, anchor, props: { gameSettings } });
});
