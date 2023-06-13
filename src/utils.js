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
		console.log('Foundry Summons | ', ...arguments);
	}
}
