<script>
	import { debug } from '../utils';
	import { selectDefaultSources } from './settings.js';

	export let gameSettings;

	const sources = gameSettings.getStore('sources');
	const onlyImages = gameSettings.getStore('onlyImages');
	const packs = game.packs.contents.filter((pack) => pack.metadata.type === 'Actor');

	let lastPick;

	$: debug('Sources', $sources);
	$: debug('Only Images', $onlyImages);

	function addToList(source, event) {
		if (event?.shiftKey && lastPick) {
			const index = packs.map((x) => x.metadata).findIndex((x) => x.id === lastPick.id);
			const lastIndex = packs.map((x) => x.metadata).findIndex((x) => x.id === source.id);

			if (index < lastIndex) {
				packs
					.map((x) => x.metadata)
					.slice(index, lastIndex + 1)
					.forEach((x) => addToList(x));
			} else {
				packs
					.map((x) => x.metadata)
					.slice(lastIndex, index + 1)
					.forEach((x) => addToList(x));
			}
		} else {
			if ($sources.map((x) => x.id).includes(source.id)) {
				$sources = $sources.filter((x) => x.id !== source.id);
			} else {
				$sources = [...$sources, source];
			}
			// Remove duplicates
			$sources.filter((value, index, self) => index === self.findIndex((t) => t.id === value.id));
		}
		lastPick = source;
	}
</script>

<div class="settings-header">
	<div class="setting">
		<div class="box right">
			<!-- svelte-ignore missing-declaration -->
			{#each packs as pack}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="option"
					on:click={(event) => addToList(pack.metadata, event)}
					class:selected={$sources.map((x) => x.id).includes(pack.metadata.id)}
				>
					{pack.title}
				</div>
			{/each}
		</div>
		<p>Summoning Sources</p>
		<p class="notes">Select the sources you want to be available in the Summoning Menu.</p>
		<p class="notes">
			<b>{$sources?.length}</b> sources selected.
			<!-- svelte-ignore a11y-missing-attribute -->
			<a
				style="color: var(--color-text-hyperlink);"
				on:click={selectDefaultSources}
				on:keydown={selectDefaultSources}
			>
				Return to Default.
			</a>
			<!-- svelte-ignore a11y-missing-attribute -->
			<a
				style="color: var(--color-text-hyperlink);"
				on:click={() => ($sources = [])}
				on:keydown={() => ($sources = [])}
			>
				Remove All.
			</a>
		</p>
		{#if debug()}<p class="notes">DEBUG | Last Picked: {lastPick?.label}</p>{/if}
	</div>
	<hr />
	<div class="setting">
		<div class="right">
			<input type="checkbox" bind:checked={$onlyImages} />
		</div>
		<p>Only Allow Tokens With Images</p>
		<p class="notes">Only tokens that have an image will be available to summon by default.</p>
	</div>
</div>

<style>
	.option {
		box-shadow: revert;
		padding-left: 0.25rem;
		&:hover {
			box-shadow: inset 0 0 0 200px #006cc41c;
		}
	}

	.selected {
		background-color: #416482;
		color: #fff;
		box-shadow: inset 0 0 0 200px #006bc44d;
	}

	.box {
		resize: vertical;
		overflow: auto;
		border: 1px solid #5e5e5e;
		border-radius: 0.25rem;
		height: 5rem;
		min-height: 5rem;
		max-height: 20rem;
	}

	.right {
		margin-left: 0.5rem;
		float: right;
		clear: right;
		max-width: 200px;
	}

	.setting {
		overflow: hidden;
		flex-wrap: wrap;
		padding: 0.125rem;

		&:hover {
			border-radius: 0.25rem;
			background-color: #0000000e;
		}
	}

	.settings-header {
		border: none;
		margin: 0.75rem 0.125rem;
		padding: 0.5rem;
		box-shadow: 0 0 4px 0 black;
		background: hsla(0, 0%, 100%, 0.25);
		border-radius: 0.25rem;
	}
</style>
