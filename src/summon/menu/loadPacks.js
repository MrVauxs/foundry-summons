import { moduleID, localize, Progress, deduplicate, debug } from '../../utils';
import { DocWrapper } from '../packs';

/**
 * Loads and Indexes Compendiums.
 *
 * @param {boolean} refresh - Redo everything.
 *
 * @param {Array} packs - Optional array of packs to load. Defaults to all packs in settings.
 *
 * @returns {Promise<Array>} Returns an array of indexed creatures.
 */
export default async function loadPacks(refresh = false, packs = game.settings.get(moduleID, 'sources')) {
	const progress = new Progress({ steps: packs.length });

	const customPackLookup = {};
	CONFIG.FoundrySummons.customPacks.forEach((pack) => (customPackLookup[pack.id] = pack));

	packs = deduplicate(packs, (pack) => pack.id).map((pack) => customPackLookup[pack.id] ?? pack);

	let index = window.foundrySummons.index ?? [];

	if (refresh) index = [];

	if (index.length > 0) return index;

	for (const pack of packs) {
		const packData = pack.getIndex ? pack : game.packs.get(pack.id);
		if (!packData) {
			debug(
				`Foundry Summons | ${localize('fs.notifications.error.loadingPack', {
					pack: pack.id ?? pack.label ?? pack.title ?? pack.name,
				})}`
			);
			continue;
		}

		const fields = [
			...game.settings.get(moduleID, 'indexFields'),
			...game.settings.get(moduleID, 'additionalIndexFields'),
		];
		let packIndex = await packData.getIndex({
			fields,
		});

		// Module Art Support (PF2e Token Bestiary and such)
		// Don't change this apparently otherwise the images don't load.
		switch (game.system.id) {
			case 'pf2e': {
				const systemPath = game.pf2e.system.moduleArt;
				await systemPath.refresh();

				packIndex = packIndex.filter((x) => x?.system?.traits);
				packIndex = packIndex.map((x) => {
					// Handle Images
					const actorArt = systemPath.map.get(x.uuid)?.img;
					x.img = actorArt ?? x.img;
					if (x.img === '') x.img = 'icons/svg/mystery-man.svg';

					// Handle Traits

					function alignmentStringToTraits(alignment) {
						if (typeof alignment !== 'string') return [];
						// returns an array of traits for the alignment string
						// e.g. "LG" -> ["lawful", "good"]

						const traits = [];
						if (alignment.includes('L')) traits.push('lawful');
						if (alignment.includes('N')) traits.push('neutral');
						if (alignment.includes('C')) traits.push('chaotic');
						if (alignment.includes('G')) traits.push('good');
						if (alignment.includes('E')) traits.push('evil');
						return traits;
					}

					if (x.system.details?.alignment?.value) {
						x.system.traits.value.push(...alignmentStringToTraits(x.system.details.alignment.value));
					}
					return x;
				});

				break;
			}
			case 'dnd5e': {
				const systemPath = game.dnd5e.moduleArt;
				await systemPath.registerModuleArt();

				packIndex = packIndex.map((x) => {
					const actorArt = systemPath.map.get(x.uuid)?.img;
					x.img = actorArt ?? x.img;
					if (x.img === '') x.img = 'icons/svg/mystery-man.svg';
					return x;
				});

				break;
			}
		}

		packIndex = packIndex.map((indexItem) =>
			indexItem.docType
				? new CONFIG.FoundrySummons.docWrapperClasses[indexItem.docType](indexItem)
				: new DocWrapper(indexItem)
		);

		index = index.concat(...packIndex);
		progress.advance(localize('fs.notifications.loadingPack', { pack: pack.label }));
	}

	// Allow third parties to add more stuff to the index
	Hooks.callAll('fs-loadingPacks', index);

	progress.close(localize('fs.notifications.loadingComplete'));

	window.foundrySummons.index = index;
	return index;
}

window.foundrySummons = window.foundrySummons || {};
window.foundrySummons = {
	...(window.foundrySummons || {}),
	loadPacks,
	refresh: () => loadPacks(true),
};
