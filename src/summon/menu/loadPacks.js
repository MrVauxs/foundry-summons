import { moduleID, localize, Progress } from '../../utils';

export default async function loadPacks(filters = [], packs = game.settings.get(moduleID, 'sources')) {
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

		await packData.getIndex({fields: game.settings.get(moduleID, "indexFields")}).then((idx) => {
			index = index.concat(...idx);
			progress.advance(localize('fs.notifications.loadingPack', { pack: pack.label }));
		});
	}

	progress.close(localize('fs.notifications.loadingComplete'));
	return index;
}