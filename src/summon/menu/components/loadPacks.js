import { moduleID, localize } from '../../../utils';
import filterPacks from './systemPackFilter';

export default async function loadPacks(packs = game.settings.get(moduleID, 'sources')) {
	const progress = new Progress({ steps: packs.length });

	let index = [];

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

		await packData.getIndex().then((idx) => {
			index = index.concat(...idx);
			progress.advance(localize('fs.notifications.loadingPack', { pack: pack.label }));
		});
	}

	index = index.filter((c) => !c.img.includes('icons/'));
	index = index.filter((c) => filterPacks(c));

	progress.close(localize('fs.notifications.loadingComplete'));
	return index;
}

/**
 * Quick and dirty API around the Loading bar.
 * Does not handle conflicts; multiple instances of this class will fight for the same loading bar, but once all but
 * once are completed, the bar should return to normal
 *
 * @category Other
 */
class Progress {
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

