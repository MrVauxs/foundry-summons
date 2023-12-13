import { moduleID, debug } from '../../utils';
/**
 * Creates new actors.
 *
 * @param {object} defaultToken The default token to use for the blank actors.
 *
 * @returns {Promise<boolean>} Returns true once the actors are created.
 */
export default async function createBlanks(defaultToken) {
	debug('Foundry Summons | System not supported. Using default blank template.');
	let npcFolder = game.folders.get(game.settings.get(moduleID, 'hiddenFolder'));

	if (!npcFolder) {
		npcFolder = await Folder.create({ name: 'Foundry Summons Blank Actors', type: 'Actor', parent: null });
		game.settings.set(moduleID, 'hiddenFolder', npcFolder.id);
	}

	let blankNPCs = game.settings.get(moduleID, 'blankNPC');
	const actorTypes = CONFIG.Actor.documentClass.TYPES;

	debug('Available Blank NPCs', blankNPCs);

	// If there are too many actors, start over.
	if (
		blankNPCs.length > actorTypes.length ||
		blankNPCs.filter((blank) => !blank.type || !actorTypes.includes(blank.type)).length
	) {
		npcFolder.content.forEach(async (actor) => {
			await actor.delete();
		});
		game.settings.set(moduleID, 'blankNPC', []);
		blankNPCs = [];
	}

	if (blankNPCs.length < actorTypes.length) {
		actorTypes.forEach((type) => {
			Actor.create({
				name: `Blank NPC (${type})`,
				type,
				img: `icons/svg/cowled.svg`,
				prototypeToken: {
					width: 1,
					height: 1,
					...defaultToken,
				},
				folder: npcFolder.id,
			}).then((actor) => {
				blankNPCs.push({ id: actor.id, type });
				game.settings.set(moduleID, 'blankNPC', blankNPCs);
			});
		});
	}

	return true;
}
