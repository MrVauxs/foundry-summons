import { localize } from '../../utils';
/**
 * Creates new actors.
 */
async function createIfMissingDummy() {
	let message = `PF2e Animations | ${localize('pf2e-jb2a-macros.notifications.noDummy')}`;
	let npcFolder = game.folders.get(game.settings.get('pf2e-jb2a-macros', 'dummyNPCId-folder'));

	if (!npcFolder) {
		npcFolder = await Folder.create({ name: 'Conjuring Foundry', type: 'Actor', parent: null });
		game.settings.set('pf2e-jb2a-macros', 'dummyNPCId-folder', npcFolder.id);
	}

	let npcActor1 = game.actors.get(game.settings.get('pf2e-jb2a-macros', 'dummyNPCId-tiny'));
	let npcActor2 = game.actors.get(game.settings.get('pf2e-jb2a-macros', 'dummyNPCId-medium'));
	let npcActor3 = game.actors.get(game.settings.get('pf2e-jb2a-macros', 'dummyNPCId-large'));
	let npcActor4 = game.actors.get(game.settings.get('pf2e-jb2a-macros', 'dummyNPCId-huge'));
	let npcActor5 = game.actors.get(game.settings.get('pf2e-jb2a-macros', 'dummyNPCId-garg'));
	if (!(npcActor1 && npcActor2 && npcActor3 && npcActor4 && npcActor5)) {
		message += ` ${localize('pf2e-jb2a-macros.notifications.creatingDummy')} `;
		ui.notifications.info(message);
		if (!npcActor1) {
			npcActor1 = await Actor.create({
				name: 'Dummy NPC (tiny)',
				type: 'npc',
				folder: npcFolder.id,
				img: 'icons/svg/cowled.svg',
				size: 'tiny',
				prototypeToken: {
					width: 0.5,
					height: 0.5,
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
							value: 'tiny',
						},
					},
				},
			});
			await game.settings.set('pf2e-jb2a-macros', 'dummyNPCId-tiny', npcActor1.id);
		}
		if (!npcActor2) {
			npcActor2 = await Actor.create({
				name: 'Dummy NPC (med)',
				type: 'npc',
				folder: npcFolder.id,
				img: 'icons/svg/cowled.svg',
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
							value: 'med',
						},
					},
				},
				size: 'med',
				prototypeToken: {
					width: 1,
					height: 1,
				},
			});
			await game.settings.set('pf2e-jb2a-macros', 'dummyNPCId-medium', npcActor2.id);
		}
		if (!npcActor3) {
			npcActor3 = await Actor.create({
				name: 'Dummy NPC (lg)',
				type: 'npc',
				folder: npcFolder.id,
				img: 'icons/svg/cowled.svg',
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
							value: 'lg',
						},
					},
				},
				size: 'lg',
				prototypeToken: {
					width: 2,
					height: 2,
				},
			});
			await game.settings.set('pf2e-jb2a-macros', 'dummyNPCId-large', npcActor3.id);
		}
		if (!npcActor4) {
			npcActor4 = await Actor.create({
				name: 'Dummy NPC (huge)',
				type: 'npc',
				folder: npcFolder.id,
				img: 'icons/svg/cowled.svg',
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
							value: 'huge',
						},
					},
				},
				size: 'huge',
				prototypeToken: {
					width: 3,
					height: 3,
				},
			});
			await game.settings.set('pf2e-jb2a-macros', 'dummyNPCId-huge', npcActor4.id);
		}
		if (!npcActor5) {
			npcActor5 = await Actor.create({
				name: 'Dummy NPC (grg)',
				type: 'npc',
				folder: npcFolder.id,
				img: 'icons/svg/cowled.svg',
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
							value: 'grg',
						},
					},
				},
				size: 'grg',
				prototypeToken: {
					width: 4,
					height: 4,
				},
			});
			await game.settings.set('pf2e-jb2a-macros', 'dummyNPCId-garg', npcActor5.id);
		}
	}
}
