import { moduleID, debug } from '../../utils';
/**
 * Creates new actors.
 */
export default async function createBlanks() {
	debug('Foundry Summons | System not supported. Using default blank template.');
	let npcFolder = game.folders.get(game.settings.get(moduleID, 'hiddenFolder'));

	if (!npcFolder) {
		npcFolder = await Folder.create({ name: 'Foundry Summons Blank Actors', type: 'Actor', parent: null });
		game.settings.set(moduleID, 'hiddenFolder', npcFolder.id);
	}

	const blankNPCs = game.settings.get(moduleID, 'blankNPC');

	debug('Available Blank NPCs', blankNPCs);

	if (blankNPCs.length === 0) {
		Actor.create({
			name: `Blank NPC`,
			type: 'npc',
			folder: npcFolder.id,
			img: `icons/svg/cowled.svg`,
			prototypeToken: {
				width: 1,
				height: 1,
			},
		}).then((actor) => {
			blankNPCs.push({ id: actor.id });
			game.settings.set(moduleID, 'blankNPC', blankNPCs);
		});
	}
}
