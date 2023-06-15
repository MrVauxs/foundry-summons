/* eslint-disable no-unused-vars */
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

	// Then we can proceed.
	let actorName = (await fromUuid(`Actor.${game.settings.get(moduleID, 'blankNPC')[0].id}`)).name;

	const actor = await fromUuid(data.creatureActor.uuid);
	const token = actor.prototypeToken;

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
		token: token.toObject(),
		actor: actor.toObject(),
	};

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

			Hooks.once('fs-summoned', () => {
				setTimeout(() => {
					_spawnedTokenDoc.update({
						alpha: 1,
					});
				}, 1000);

				debug('Used default summoning animation.');
				return false;
			});

			Hooks.call('fs-summoned', { _location, _spawnedTokenDoc, _updates, _iteration });
		},
	};

	const options = {};

	switch (game.system.id) {
		case 'pf2e': {
			actorName = (
				await fromUuid(
					`Actor.${game.settings.get(moduleID, 'blankNPC').find((blank) => blank.size === actor.size).id}`
				)
			).name;
			break;
		}
	}

	const x = data.location.x - data.location.distance * canvas.grid.size + 50;
	const y = data.location.y - data.location.distance * canvas.grid.size + 50;

	debug('Summoning', actorName, 'at', x, y, 'with', updates, callbacks, options);

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
