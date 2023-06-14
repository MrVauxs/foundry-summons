function filterPacks(creature) {
    if (game.settings.get(moduleID, 'onlyImages')) {
		index = index.filter((c) => !c.img.includes('icons/'));
	}
	switch (game.system.id) {
		case 'pf2e': {
			// If it's not an NPC, like hazards, we don't want it.
			if (creature.type !== 'npc') return false;

			// If it's uncommon and we don't allow uncommons, we don't want it.
			if (!game.settings.get(moduleID, 'noUncommon') && creature.system.traits.rarity !== 'common') {
				return false;
			}

			return true;
		}
		default: {
			return true;
		}
	}
}
export function getFilters() {
	const filters = [];
	switch (game.system.id) {
		case 'pf2e': {
			// If it's uncommon and we don't allow uncommons, we don't want it.
			if (game.settings.get(moduleID, 'noUncommon')) {
				filters.push('No Uncommon Creatures.');
			}
		}
	}
	return filters;
}