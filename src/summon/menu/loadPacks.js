import { moduleID, localize, Progress } from '../../utils';

/**
 * Loads and Indexes Compendiums.
 *
 * @param {boolean} refresh - Redo everything.
 *
 * @param {Array} packs - Optional array of packs to load. Defaults to all packs in settings.
 *
 * @returns {Array} An array of indexed creatures.
 */
export default async function loadPacks(refresh = false, packs = game.settings.get(moduleID, 'sources')) {
	const progress = new Progress({ steps: packs.length });

	let index = window.foundrySummons.index ?? [];

	if (index.length > 0 && !refresh) return index;

	for (const pack of packs) {
		const packData = game.packs.get(pack.id);
		if (!packData) {
			ui.notifications.error(
				`Foundry Summons | ${localize('fs.notifications.error.loadingPack', {
					pack: pack.id ?? pack?.label ?? pack?.title ?? pack?.name,
				})}`
			);
			continue;
		}

		const packIndex = await packData.getIndex({ fields: game.settings.get(moduleID, 'indexFields') });

		// Module Art Support (PF2e Token Bestiary and such)
		switch (game.system.id) {
			case 'pf2e': {
				const systemPath = game.pf2e.system.moduleArt;
				await systemPath.refresh();

				packIndex.map((x) => {
					const actorArt = systemPath.map.get(x.uuid)?.img;
					x.img = actorArt ?? x.img;
					if (x.img === '') x.img = 'icons/svg/mystery-man.svg';
					return x;
				});

				break;
			}
			case 'dnd5e': {
				const systemPath = game.dnd5e.moduleArt;
				await systemPath.registerModuleArt();

				packIndex.map((x) => {
					const actorArt = systemPath.map.get(x.uuid)?.img;
					x.img = actorArt ?? x.img;
					if (x.img === '') x.img = 'icons/svg/mystery-man.svg';
					return x;
				});

				break;
			}
		}

		index = index.concat(...packIndex);
		progress.advance(localize('fs.notifications.loadingPack', { pack: pack.label }));
	}

	progress.close(localize('fs.notifications.loadingComplete'));

	window.foundrySummons.index = index;
	return index;
}
