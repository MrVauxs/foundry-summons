import { debug, localize, moduleID } from '../utils';
import { openMenu } from './menu/SummoningMenu.js';

/*
 * ============================================
 *    The Whole Idea So I Don't Get F' Lost
 * ============================================
 *
 * 1. Player begins summoning process.
 * 1a. Player selects a creature they want to summon.
 * 1b. Player selects a location to summon the creature.
 *
 * 2. Player tunnels the data to the GM.
 *
 * 3. GM approves the summoning.
 * 3a. Tunnel the response back to the Player.
 *
 * 4. Player's creature is summoned by the GM.
 * 4a. This process should be able to be modified by other modules, primarily animations.
 *     Could be Hooks? Could be a function you need to pass in the beginning of the whole process but that's ugly.
 *
 * =========================================
 *	       The Data Should Include:
 * =========================================
 * 	- Actor Data or UUID
 * 	- Location on Active Scene
 *  - Optionally...
 * 		- Pan to Location?
 * 		- "What Dunnit" Data (spell, item, chat message, etc.)
 * 			- UUID
 * 			- Name
 * 		- Summoner Data
 * 			- Token
 * 			- Actor
 * 			- User
 */

/** Foundry socket variable */
let fs_socket;

Hooks.once('socketlib.ready', () => {
	fs_socket = socketlib.registerModule(moduleID);
	fs_socket.register('summon', summon);
});

Hooks.on('ready', () => {
	if (!game.modules.get('portal-lib')?.active) {
		return ui.notifications.error(localize('fs.notifications.error.portal-lib'));
	}
	if (!game.modules.get('socketlib')?.active) {
		return ui.notifications.error(localize('fs.notifications.error.socketlib'));
	}
});

/**
 * Summons a creature using GM permissions.
 * Can, or at least should only be ran by the GM.
 *
 * @param {object} data - The data to summon the creature.
 *
 * @returns {void} Summons the Creature on the Scene
 */
async function summon(data) {
	if (!game.user.isGM)
		return ui.notifications.error(`Foundry Summons | ${localize('fs.notifications.error.permission')}`);
	debug('Received', data);

	const ClassDocWrapper = CONFIG.FoundrySummons.docWrapperClasses[data.creatureActor.docType];
	if (!ClassDocWrapper)
		throw new Error(localize('fs.notifications.error.docType', { docType: data.creatureActor.docType }));

	const docWrapper = ClassDocWrapper.deserialize(data.creatureActor);
	const actorData = await docWrapper.loadDocument();

	if (data.location.docName === 'MeasuredTemplate') data.location = await fromUuid(data.location.uuid);

	let actor = actorData;
	let token = actor.prototypeToken;

	// Fix wildcard tokens.
	const tokenImages = await actor.getTokenImages();
	token.texture.src = tokenImages[Math.floor(Math.random() * tokenImages.length)];

	if (!actorData.uuid.startsWith('Compendium')) {
		actor = {};
		token = { flags: {} };
	}

	const updates = {
		token: token.toObject ? token.toObject() : { flags: {} },
		actor: actor.toObject ? actor.toObject() : { flags: {} },
	};

	foundry.utils.mergeObject(updates, actorData.updates ?? {});
	foundry.utils.mergeObject(updates, data.updates);

	updates.actor.ownership = { [data.userId]: 3 };

	updates.token.flags['foundry-summons'] = {
		scrollingText: game.settings.get('core', 'scrollingStatusText'),
		bloodsplatter: game.modules.get('splatter')?.active
			? game.settings.get('splatter', 'enableBloodsplatter')
			: null,
		'token-mold': game.modules.get('token-mold')?.active
			? game.settings.get('Token-Mold', 'everyone').name.use
			: null,
	};

	const options = { count: data.amount, flags: data.flags };

	switch (game.system.id) {
		case 'pf2e': {
			if (actorData.uuid.startsWith('Compendium') && data.summonerTokenDocument?.actorId) {
				updates.actor.system.details.alliance = (
					await fromUuid(`Actor.${data.summonerTokenDocument?.actorId}`)
				).system.details.alliance;
			}
			// Delete token width and height to use the default size of
			// our tokens because PF2e Bestiaries rely a bit TOO MUCH on auto-scaling.
			break;
		}
	}

	if (data.summonerTokenDocument?.disposition) {
		updates.token.disposition = data.summonerTokenDocument?.disposition;
	}

	const x = data.location.x; //  - data.location.distance * canvas.grid.size
	const y = data.location.y;

	debug(`Summoning${options.count ? ` ${options.count}` : ''}`, actorData.name, 'at', x, y, 'with', updates, options);

	const portal = new Portal()
		.addCreature(actorData.uuid, { updateData: updates, count: options.count ?? 1 })
		.setLocation({ x, y });

	if (
		game.settings.get(moduleID, 'debug') ||
		(!game.settings.get(moduleID, 'autoAccept') && !(game.user.id === data.userId))
	) {
		// If the GM has auto accept disabled, we need to ask them if they want to summon the creature.
		try {
			await portal.dialog({
				spawn: false,
				multipleChoice: false,
				title: localize(`fs.dialog.title`, {
					player: game.users.get(data.userId).name,
				}),
			});
		} catch (err) {
			if (data.location?.constructor?.name.includes('MeasuredTemplate')) {
				data.location.delete();
			}
			return { ...data, tokenIds: false };
		}
	}

	try {
		const results = portal.spawn();

		results.then(() => {
			if (data.location?.constructor?.name.includes('MeasuredTemplate')) {
				data.location.delete();
			}
		});

		return { ...data, tokenIds: (await results).map((tok) => tok._id) };
	} catch (error) {
		ui.notifications.error(`Foundry Summons | ${localize('fs.notifications.error.summon')}`);
		console.log(`Foundry Summons | ${localize('fs.notifications.error.summon')}`, {
			actorName: actorData.name,
			updates,
			options,
		});
		throw Error(error);
	}
}

window.foundrySummons = window.foundrySummons || {};
window.foundrySummons = {
	...(window.foundrySummons || {}),
	openMenu,
	summon,
	debug,
};

export { fs_socket };
