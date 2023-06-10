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
	warpgate.event.watch('fs-summon', summonGM, warpgate.util.isFirstGM);
});

/**
 * Summons a creature using GM permissions.
 *
 * @param {object} data - The data to summon the creature.
 *
 * @returns {void} Summons the Creature on the Scene
 */
function summonGM(data) {
	if (!game.user.isGM)
		return ui.notifications.error(
			"Foundry Summons | You don't have permission to do that. How did you run this function?"
		);
	debug('Received', data);
	createBlanks();
}

/**
 * Send a request to the GM to summon a creature.
 *
 * @param {object} data - The data to send to the GM.
 */
export function summonPC(data = {}) {
	debug('Sending', data);
	warpgate.event.notify('fs-summon', data);
}

window.foundrySummons = window.foundrySummons || {};
window.foundrySummons = {
	...(window.foundrySummons || {}),
	openMenu,
	summonPC,
	summonGM,
	debug,
};
