/* eslint-disable no-unused-vars */
import { debug, localize, moduleID } from '../utils';
import { openMenu } from './menu/SummoningMenu.js';
import { createBlanks } from './templateActors/index.js';

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

	// We need Actors to overwrite, so make sure they exist first.
	createBlanks();

	// Then, proceed.

	console.log((await fromUuid("Actor." + game.settings.get(moduleID, 'blankNPC')[0].id)))

	let actorName = (await fromUuid("Actor." + game.settings.get(moduleID, 'blankNPC')[0].id)).name;

	const actor = await fromUuid(data.creature.uuid);
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
		actor: actor.toObject()
	}

	const callbacks = {
		pre: async (location, updates) => {
			mergeObject(updates, {
				token: {
					alpha: 0,
				},
			});
			await game.settings.set('core', 'scrollingStatusText', false);
			if (game.modules.get('splatter')?.active) await game.settings.set('splatter', 'enableBloodsplatter', false);
			if (game.modules.get('token-mold')?.active)
				await game.settings.set('Token-Mold', 'everyone', {
					...game.settings.get('Token-Mold', 'everyone'),
					...{ name: { use: false } },
				});
		},
		post: async (location, spawnedTokenDoc, updates, iteration) => {
			let defaultVisibility = true;
			// TODO: Not sure if I should call or callAll...
			Hooks.callAll('fs-summoned', location, spawnedTokenDoc, updates, iteration, defaultVisibility)

			if (updates.token.flags['foundry-summons']?.scrollingText)
				await game.settings.set('core', 'scrollingStatusText', true);
			if (updates.token.flags['foundry-summons']?.bloodsplatter)
				await game.settings.set('splatter', 'enableBloodsplatter', true);
			if (updates.token.flags['foundry-summons']?.tokenmold)
				await game.settings.set('Token-Mold', 'everyone', {
					...game.settings.get('Token-Mold', 'everyone'),
					...{ name: { use: true } },
				});

			setTimeout(() => {
				spawnedTokenDoc.update({
					alpha: 1,
				})
			}, 1000)
		},
	};

	const options = {}

	switch (game.system.id) {
		case 'pf2e': {
			actorName = (await fromUuid("Actor." + game.settings.get(moduleID, 'blankNPC').find(x => x.size === (actor.size)).id)).name;
			break;
		}
	}

	debugger;

	warpgate.spawnAt(data.location, actorName, updates, callbacks, options)
}

window.foundrySummons = window.foundrySummons || {};
window.foundrySummons = {
	...(window.foundrySummons || {}),
	openMenu,
	summon,
	debug,
};
