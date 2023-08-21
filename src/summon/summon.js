import { debug, localize, moduleID } from '../utils';
import { openMenu } from './menu/SummoningMenu.js';

/**
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

Hooks.on('ready', () => {
	if (!game.modules.get('warpgate')?.active) {
		return ui.notifications.error(localize('fs.notifications.error.warpgate'));
	}
	warpgate.event.watch('fs-summon', summon, warpgate.util.isFirstGM);
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

	if (
		game.settings.get(moduleID, 'debug') ||
		(!game.settings.get(moduleID, 'autoAccept') && !(game.user.id === data.userId))
	) {
		// If the GM has auto accept disabled, we need to ask them if they want to summon the creature.
		const summoning = await Dialog.confirm({
			title: localize('fs.dialog.title'),
			content: localize('fs.dialog.request', {
				player: game.users.get(data.userId).name,
				amount: data.amount,
				creature: actorData.name,
			}),
			label: localize('fs.dialog.accept'),
		});

		if (!summoning) {
			if (data.location?.constructor?.name.includes('MeasuredTemplate')) {
				data.location.delete();
			}
			return;
		}
	}

	// Then we can proceed.
	let actorName = (await fromUuid(`Actor.${game.settings.get(moduleID, 'blankNPC')[0].id}`)).name;
	let actor = actorData;
	let token = actor.prototypeToken;

	if (!actorData.uuid.startsWith('Compendium')) {
		actorName = actorData.name;
		actor = {};
		token = { flags: {} };
	}

	Object.assign(token.flags, {
		'foundry-summons': {
			scrollingText: game.settings.get('core', 'scrollingStatusText'),
			bloodsplatter: game.modules.get('splatter')?.active
				? game.settings.get('splatter', 'enableBloodsplatter')
				: null,
			'token-mold': game.modules.get('token-mold')?.active
				? game.settings.get('Token-Mold', 'everyone').name.use
				: null,
		},
	});

	const updates = {
		token: token.toObject ? token.toObject() : { flags: {} },
		actor: actor.toObject ? actor.toObject() : { flags: {} },
	};

	foundry.utils.mergeObject(updates, actorData.updates ?? {});
	foundry.utils.mergeObject(updates, data.updates);

	updates.token.actorData = { ownership: { [data.userId]: 3 } };

	const callbacks = {
		pre: async function (_location, _updates) {
			mergeObject(_updates, {
				token: {
					alpha: 0,
				},
			});
			// Remove scrolling text if effects or hp are modified.
			await game.settings.set('core', 'scrollingStatusText', false);

			// If hp is modified, don't splatter all over the token.
			if (game.modules.get('splatter')?.active) {
				await game.settings.set('splatter', 'enableBloodsplatter', false);
			}

			// If the token is modified, don't change the name.
			if (game.modules.get('token-mold')?.active) {
				await game.settings.set('Token-Mold', 'everyone', {
					...game.settings.get('Token-Mold', 'everyone'),
					...{ name: { use: false } },
				});
			}

			Hooks.callAll('fs-preSummon', { location: _location, updates: _updates, sourceData: data });
		},
		post: async function (_location, _spawnedTokenDoc, _updates, _iteration) {
			// Remove scrolling text if effects or hp are modified.
			if (updates.token.flags['foundry-summons']?.scrollingText) {
				await game.settings.set('core', 'scrollingStatusText', true);
			}

			// If hp is modified, don't splatter all over the token.
			if (updates.token.flags['foundry-summons']?.bloodsplatter) {
				await game.settings.set('splatter', 'enableBloodsplatter', true);
			}

			// If the token is modified, don't change the name.
			if (updates.token.flags['foundry-summons']?.tokenmold) {
				await game.settings.set('Token-Mold', 'everyone', {
					...game.settings.get('Token-Mold', 'everyone'),
					...{ name: { use: true } },
				});
			}

			Hooks.once('fs-postSummon', ({ tokenDoc }) => {
				setTimeout(() => {
					tokenDoc.update({
						alpha: 1,
					});
				}, 250);

				console.log('Foundry Summons | Used default summoning animation.');
				return false;
			});

			Hooks.callAll('fs-postSummon', {
				location: _location,
				tokenDoc: _spawnedTokenDoc,
				updates: _updates,
				iteration: _iteration,
				sourceData: data,
			});
		},
	};

	const options = { duplicates: data.amount, flags: data.flags };

	switch (game.system.id) {
		case 'pf2e': {
			const futureActorName = (
				await fromUuid(
					`Actor.${
						game.settings
							.get(moduleID, 'blankNPC')
							.find((blank) => (actor.size === 'sm' ? blank.size === 'med' : blank.size === actor.size))
							?.id
					}`
				)
			)?.name;

			if (futureActorName) actorName = futureActorName;

			if (actorData.uuid.startsWith('Compendium') && data.summonerTokenDocument?.actorId) {
				updates.actor.system.details.alliance = (
					await fromUuid(`Actor.${data.summonerTokenDocument?.actorId}`)
				).system.details.alliance;
			}
			// Delete token width and height to use the default size of
			// our tokens because PF2e Bestiaries rely a bit TOO MUCH on auto-scaling.
			updates.token.width = undefined;
			updates.token.height = undefined;
			break;
		}
	}

	const x = data.location.x; //  - data.location.distance * canvas.grid.size
	const y = data.location.y;

	debug(
		`Summoning${options.duplicates ? ` ${options.duplicates}` : ''}`,
		actorName,
		'at',
		x,
		y,
		'with',
		updates,
		callbacks,
		options
	);

	warpgate
		.spawnAt(
			{
				x,
				y,
			},
			actorName,
			updates,
			callbacks,
			options
		)
		.then(() => {
			if (data.location?.constructor?.name.includes('MeasuredTemplate')) {
				data.location.delete();
			}
		});
}

window.foundrySummons = window.foundrySummons || {};
window.foundrySummons = {
	...(window.foundrySummons || {}),
	openMenu,
	summon,
	debug,
};
