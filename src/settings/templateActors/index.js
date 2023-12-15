import pf2e from './pf2e.js';
import defaultBlanks from './default.js';
import { moduleID } from '../../utils.js';

/**
 * Creates the blank template actors for the system.
 *
 * @returns {void} Creates the blank actors, ready for summoning.
 */
export async function createBlanks() {
	if (!game.user.isGM) return;
	const blankNPCs = await game.settings.get(moduleID, 'blankNPC');
	// Check if all Actors exist. If not, remove fakers.
	if (blankNPCs.filter((x) => fromUuidSync(`Actor.${x.id}`)).length !== blankNPCs.length) {
		await game.settings.set(
			moduleID,
			'blankNPC',
			blankNPCs.filter((x) => fromUuidSync(`Actor.${x.id}`))
		);
	}

	const defaultToken = game.settings.get('core', 'defaultToken');

	switch (game.system.id) {
		case 'pf2e':
			return await pf2e(defaultToken);
		default:
			return await defaultBlanks(defaultToken);
	}
}
