export const moduleID = 'foundry-summons';

/**
 * Returns the localized string for the given key.
 *
 * @param {string} key - The localization
 *
 * @param {object} format - Formatting to add to the localized string
 *
 * @returns {string} The localized string
 */
export function localize(key, format) {
	if (key.startsWith('fs')) {
		key = key.replace('fs.', 'foundry-summons.');
	}
	if (format) {
		return game.i18n.format(key, format);
	} else {
		return game.i18n.localize(key);
	}
}

/**
 * Sends out a console log if debug mode is enabled.
 *
 * @param {any} args - The arguments to log
 *
 * @returns {void}
 */
export function debug() {
	if (game.settings.get(moduleID, 'debug')) {
		if (arguments.length > 0) {
			console.log('Foundry Summons |', ...arguments);
		}
		return true;
	}
}

/**
 * Removes duplicates from an array of objects based on a key.
 * @example deduplicate(items, (item) => item.id));
 * @param {array} array
 * @param {function} getKey
 * @returns
 */
export function deduplicate(array, getKey) {
	const seenItems = {};
	return array.filter((item) => {
		const key = getKey(item);
		if (seenItems[key]) {
			return false;
		}
		seenItems[key] = true;
		return true;
	});
}

/**
 * Stolen from the PF2e system.
 *
 * Quick and dirty API around the Loading bar.
 * Does not handle conflicts; multiple instances of this class will fight for the same loading bar, but once all but
 * once are completed, the bar should return to normal
 *
 * @category Other
 */
export class Progress {
	constructor({ steps = 1 } = {}) {
		this.steps = steps;
		this.counter = -1;
	}

	advance(label) {
		this.counter += 1;
		const pct = Math.floor((100 * this.counter) / this.steps);
		SceneNavigation.displayProgressBar({ label, pct });
	}

	close(label) {
		SceneNavigation.displayProgressBar({ label, pct: 100 });
	}
}
