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
	if (format) {
		return game.i18n.format(key, format);
	}
	return game.i18n.localize(key);
}

/**
 * Sends out a console log if debug mode is enabled.
 */
export function debug() {
	if (game.settings.get(moduleID, 'debug')) {
		console.log(moduleID, '|', ...arguments);
	}
}
