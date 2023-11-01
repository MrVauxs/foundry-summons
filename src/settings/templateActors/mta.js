import { moduleID, debug } from '../../utils';
/**
 * Creates new actors.
 *
 * @param {object} defaultToken The default token to use for the blank actors.
 *
 * @returns {Promise<boolean>} Returns true once the actors are created.
 */
export default async function createBlanks(defaultToken) {
	let npcFolder = game.folders.get(game.settings.get(moduleID, 'hiddenFolder'));

	if (!npcFolder) {
		npcFolder = await Folder.create({ name: 'Foundry Summons Blank Actors', type: 'Actor', parent: null });
		game.settings.set(moduleID, 'hiddenFolder', npcFolder.id);
	}

	let blankNPCs = game.settings.get(moduleID, 'blankNPC');

	debug('Available Blank NPCs', blankNPCs);

	if (blankNPCs.length > 2) {
		npcFolder.content.forEach(async (actor) => {
			await actor.delete();
		});
		game.settings.set(moduleID, 'blankNPC', []);
		blankNPCs = [];
	}

	if (!blankNPCs.find((blank) => game.actors.get(blank.id)?.type === 'character')) {
		Actor.create({
			name: `Blank Character`,
			type: 'character',
			img: `icons/svg/cowled.svg`,
			prototypeToken: {
				width: 1,
				height: 1,
				...defaultToken,
			},
			folder: npcFolder.id,
		}).then((actor) => {
			blankNPCs.push({ id: actor.id });
			game.settings.set(moduleID, 'blankNPC', blankNPCs);
		});
	}

	if (!blankNPCs.find((blank) => game.actors.get(blank.id)?.type === 'ephemeral')) {
		Actor.create({
			name: `Blank Ephemeral`,
			type: 'ephemeral',
			img: `icons/svg/cowled.svg`,
			prototypeToken: {
				width: 1,
				height: 1,
				...defaultToken,
			},
			folder: npcFolder.id,
		}).then((actor) => {
			blankNPCs.push({ id: actor.id });
			game.settings.set(moduleID, 'blankNPC', blankNPCs);
		});
	}

	return true;
}
