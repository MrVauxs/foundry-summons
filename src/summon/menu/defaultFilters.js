import { localize, moduleID } from '../../utils.js';
/**
 * Default filters for the filter menu based on settings.
 *
 * @returns {Array} An array of filter objects to merge with another filter array, or standalone.
 */
export default function defaultFilters() {
	const filterArray = [];

	if (game.settings.get(moduleID, 'onlyImages')) {
		filterArray.push({
			name: localize('fs.menu.onlyImages'),
			function: (creatures) => creatures.filter((x) => !x.img.includes('icons/')),
			locked: true,
		});
	}

	if (game.system.id === 'pf2e' && game.settings.get(moduleID, 'noUncommon')) {
		filterArray.push({
			name: localize('fs.menu.noUncommon'),
			function: (creatures) => creatures.filter((x) => x.system.traits.rarity === 'common'),
			locked: true,
		});
	}

	return filterArray;
}
