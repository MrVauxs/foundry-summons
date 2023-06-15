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

			game.settings.set(moduleID, 'sources', array);
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

/**
 * What properties to index when loading packs.
 */
export function setDefaultIndexFields() {
	switch (game.system.id) {
		case 'dnd5e': {
			game.settings.set(moduleID, 'indexFields', ['img']);
			break;
		}
		case 'pf2e': {
			game.settings.set(moduleID, 'indexFields', game.pf2e.compendiumBrowser.tabs.bestiary.index);
			break;
		}
		default: {
			game.settings.set(moduleID, 'indexFields', ['']);
			break;
		}
	}
}
