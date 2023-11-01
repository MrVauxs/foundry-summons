import { gameSettings } from './settings.js';
import { moduleID } from '../utils';

/**
 * Register system specific settings.
 */
export function registerSystemSettings() {
	switch (game.system.id) {
		case 'pf2e': {
			gameSettings.register({
				namespace: moduleID,
				key: 'noUncommon',
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

/**
 * What sources to load when loading packs.
 */
export function selectDefaultSources() {
	switch (game.system.id) {
		case 'dnd5e': {
			const array = game.packs.contents
				.filter((pack) => pack.metadata.type === 'Actor')
				.map((x) => x.metadata)
				.filter((x) => x.name === 'monsters');

			gameSettings.getStore('sources').set(array);
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

			gameSettings.getStore('sources').set(array);
			break;
		}
		default: {
			gameSettings.getStore('sources').set([]);
			break;
		}
	}
}

/**
 * What properties to index when loading packs.
 */
export function setDefaultIndexFields() {
	switch (game.system.id) {
		case 'dnd5e': {
			gameSettings.getStore('indexFields').set(['img', 'system.details.cr', 'system.details.type.value']);
			break;
		}
		case 'pf2e': {
			gameSettings.getStore('indexFields').set(game.pf2e.compendiumBrowser.tabs.bestiary.index);
			break;
		}
		default: {
			gameSettings.getStore('indexFields').set(['']);
			break;
		}
	}
}
