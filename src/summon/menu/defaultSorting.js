/* eslint-disable id-length */
import { localize } from '../../utils.js';
/**
 * Default sorting methods for the summoning menu based on the system.
 *
 * @returns {Array} An array of sorting objects to merge with another filter array, or standalone.
 */
export default function defaultSorting() {
	const sortingArray = [
		{
			name: localize('fs.menu.sort.alphabetical'),
			function: (a, b) => a.name.localeCompare(b.name),
		},
	];

	if (game.system.id === 'pf2e') {
		sortingArray.push({
			name: localize('fs.menu.sort.pf2e.level.ascending'),
			function: (a, b) => a.system.details.level.value - b.system.details.level.value,
		});
		sortingArray.push({
			name: localize('fs.menu.sort.pf2e.level.descending'),
			function: (b, a) => a.system.details.level.value - b.system.details.level.value,
		});
	}

	if (game.system.id === 'dnd5e') {
		sortingArray.push({
			name: localize('fs.menu.sort.5e.cr.ascending'),
			function: (a, b) => a.system.details.cr - b.system.details.cr,
		});
		sortingArray.push({
			name: localize('fs.menu.sort.5e.cr.descending'),
			function: (b, a) => a.system.details.cr - b.system.details.cr,
		});
	}

	return sortingArray;
}
