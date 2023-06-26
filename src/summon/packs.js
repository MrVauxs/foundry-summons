export class DocWrapper {
	constructor(indexItem) {
		if (typeof indexItem === 'string') indexItem = JSON.parse(indexItem);

		this.docType = this.constructor.name;
		Object.assign(this, indexItem);

		this.id ??= this.uuid;

		// #region Validation
		this.valid = true;
		if (!this.name) {
			this.valid = false;
			ui.notifications.error('Foundry Summons | Error loading pack index. An entry is missing a name!');
		}
		if (!this.uuid) {
			this.valid = false;
			ui.notifications.error('Foundry Summons | Error loading pack index. An entry is missing a uuid!');
		}
		if (!this.valid) {
			return console.log(this);
		}
		// #endregion Validation
	}

	serialize() {
		return { docType: this.docType, document: JSON.stringify(this) };
	}

	static deserialize(data) {
		return new this(data.document);
	}

	async loadDocument() {
		return await fromUuid(this.uuid);
	}
}

Hooks.once('ready', () => {
	CONFIG.FoundrySummons = {
		docWrapperClasses: {
			DocWrapper,
		},
	};
	Hooks.callAll('fs-addWrapperClasses', CONFIG.FoundrySummons.docWrapperClasses);
});
