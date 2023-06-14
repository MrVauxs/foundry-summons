import { moduleID } from '../../../utils';

export default function filterPacks(creature) {
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
