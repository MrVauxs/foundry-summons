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

	const neededSizes = ['tiny', 'med', 'lg', 'huge', 'grg'];
	const actorTypes = CONFIG.Actor.documentClass.TYPES.filter((type) => type !== 'base');

	const allNeededActors = neededSizes
		.map((size) => {
			return { size, type: 'npc' };
		})
		.concat(actorTypes.filter((x) => x !== 'npc' && x !== 'party' && x !== 'base').map((type) => ({ type })));

	// If there are too many actors, start over.
	if (blankNPCs.length !== allNeededActors.length) {
		npcFolder.content.forEach(async (actor) => {
			await actor.delete();
		});
		game.settings.set(moduleID, 'blankNPC', []);
		blankNPCs = [];
	}

	if (blankNPCs.length < allNeededActors.length) {
		allNeededActors.forEach((dummy) => {
			let xy = 1;
			switch (dummy.size) {
				case 'tiny':
					xy = 0.5;
					break;
				case 'med':
					xy = 1;
					break;
				case 'lg':
					xy = 2;
					break;
				case 'huge':
					xy = 3;
					break;
				case 'grg':
					xy = 4;
					break;
				default:
					break;
			}

			Actor.create({
				name: `Blank ${dummy.type.toUpperCase()} ${dummy.size ? `(${dummy.size})` : ''}`,
				type: dummy.type,
				img: `icons/svg/cowled.svg`,
				size: dummy.size,
				prototypeToken: {
					width: xy,
					height: xy,
					...defaultToken,
				},
				system:
					dummy.type === 'npc'
						? {
								attributes: {
									hp: {
										max: 999,
										value: 999,
										base: 999,
										slug: 'hp',
									},
								},
								traits: {
									size: {
										value: dummy.size,
									},
								},
						  }
						: {},
				folder: npcFolder.id,
			}).then((actor) => {
				blankNPCs.push({ id: actor.id, size: dummy.size, type: dummy.type });
				game.settings.set(moduleID, 'blankNPC', blankNPCs);
			});
		});
	}

	return true;
}
