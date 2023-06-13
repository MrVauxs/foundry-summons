import { localize, moduleID, debug } from '../../utils';
/**
 * Creates new actors.
 */
export default async function createBlanks() {
	let npcFolder = game.folders.get(game.settings.get(moduleID, 'hiddenFolder'));

	if (!npcFolder) {
		npcFolder = await Folder.create({ name: 'Foundry Summons Blank Actors', type: 'Actor', parent: null });
		game.settings.set(moduleID, 'hiddenFolder', npcFolder.id);
	}

	let blankNPCs = game.settings.get(moduleID, 'blankNPC');

	debug('Available Blank NPCs', blankNPCs);

	// Check if all Actors exist. If not, remove fakers.
	if (blankNPCs.filter((x) => fromUuidSync(`Actor.${x.id}`)).length !== blankNPCs.length) {
		game.settings.set(
			moduleID,
			'blankNPC',
			blankNPCs.filter((x) => fromUuidSync(`Actor.${x.id}`))
		);
		blankNPCs = blankNPCs.filter((x) => fromUuidSync(`Actor.${x.id}`));
	}

	const neededSizes = ['tiny', 'med', 'lg', 'huge', 'grg'];

	if (blankNPCs.length < neededSizes.length) {
		const message = `Foundry Summons | ${localize(`${moduleID}.notifications.blanks`)}`;
		debug(message, ui.notifications.info(message));

		// const neededSizes = ['tiny', 'med', 'lg', 'huge', 'grg'];
		const existingSizes = blankNPCs.map((actor) => actor.size);
		const togetherNow = [...neededSizes, ...existingSizes];

		const map = new Map();
		togetherNow.forEach((x) => map.set(x, map.has(x) ? map.get(x) + 1 : 1));
		const missingSizes = togetherNow.filter((x) => map.get(x) === 1);

		debug('Missing Sizes', missingSizes);

		missingSizes.forEach((size) => {
			const name = `Blank NPC (${size})`;
			const img = `icons/svg/cowled.svg`;
			const width = size === 'tiny' ? 0.5 : size === 'med' ? 1 : size === 'lg' ? 2 : size === 'huge' ? 3 : 4;
			const height = size === 'tiny' ? 0.5 : size === 'med' ? 1 : size === 'lg' ? 2 : size === 'huge' ? 3 : 4;

			Actor.create({
				name,
				type: 'npc',
				folder: npcFolder.id,
				img,
				size,
				prototypeToken: {
					width,
					height,
				},
				system: {
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
							value: size,
						},
					},
				},
			}).then((actor) => {
				blankNPCs.push({ id: actor.id, size });
				game.settings.set(moduleID, 'blankNPC', blankNPCs);
			});
		});
	}
}
