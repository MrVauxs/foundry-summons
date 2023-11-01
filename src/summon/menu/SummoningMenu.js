import { SvelteApplication } from '@typhonjs-fvtt/runtime/svelte/application';

import SummoningMenu from './SummoningMenu.svelte';

export default class SummoningApplication extends SvelteApplication {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: 'foundry-summons.menu.title',
			width: 800,
			height: 600,
			svelte: {
				class: SummoningMenu,
				target: document.body,
			},
		});
	}
}

/**
 * Opens the summoning menu with all the options.
 *
 * TODO: Type-ify the props.
 *
 * @param {object} args - The props to pass to the Svelte component.
 *
 * @returns {void}
 */
export async function openMenu(args) {
	// Opens the menu with the props passed.
	// The player sends a warpgate.event through the menu to the GM, who then summons the creature.
	new SummoningApplication().render(true, { focus: true, svelte: { props: { ogData: args } } });

	let promiseReject, promiseResolve;

	const promise = new Promise((resolve, reject) => {
		promiseResolve = resolve;
		promiseReject = reject;
	});

	// After the above is done, the function below catches the response from the GM back to the player.
	warpgate.event.trigger(
		'fs-summonNotifyPlayer',
		(data) => {
			promiseResolve(data);
		},
		(data) => {
			return data.player === game.user.id;
		}
	);

	return promise;
}
