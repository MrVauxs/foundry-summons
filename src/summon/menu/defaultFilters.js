import { debug, localize, moduleID } from '../../utils.js';
export default function defaultFilters() {
	const filterArray = [];

	if (game.settings.get(moduleID, 'onlyImages')) {
		filterArray.push({
			name: localize('fs.menu.onlyImages'),
			function: (creatures) => creatures.filter((c) => !c.img.includes('icons/')),
			locked: true,
		});
	}

	if (game.system.id === 'pf2e' && game.settings.get(moduleID, 'noUncommon')) {
		filterArray.push({
			name: localize('fs.menu.noUncommon'),
			function: (creatures) => creatures.filter((c) => c.system.traits.rarity !== 'common'),
			locked: true,
		});
	}

	return filterArray;
}
