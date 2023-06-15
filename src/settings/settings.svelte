<script>
	import { debug } from '../utils';
	import { selectDefaultSources, setDefaultIndexFields } from './systemSpecific.js';
	import SystemSpecific from './systemSpecific.svelte';

	export let gameSettings;

	const sources = gameSettings.getStore('sources');
	const onlyImages = gameSettings.getStore('onlyImages');
	const autoAccept = gameSettings.getStore('autoAccept');
	const indexFields = gameSettings.getStore('indexFields');
	const packs = game.packs.contents.filter((pack) => pack.metadata.type === 'Actor');

	let lastPick;
	let indexFieldString = $indexFields.toString();

	$: $indexFields = indexFieldString.split(',').map((x) => x.trim());

	$: debug('Sources', $sources);
	$: debug('Only Images', $onlyImages);
	$: debug('Auto Accept', $autoAccept);
	$: debug('Index Fields', $indexFields);

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

<div class="settings-box foundry-summons">
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
		<p>
			Summoning Sources {#if debug()}(sources){/if}
		</p>
		<p class="notes">Select the sources you want to be available in the Summoning Menu.</p>
		<p class="notes">
			<b>{$sources?.length}/{packs.length}</b> sources selected.
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
	</div>
	<hr />
	<div class="setting">
		<div class="right">
			<input type="checkbox" bind:checked={$onlyImages} />
		</div>
		<p>
			Only Allow Summons With Token Images {#if debug()}(onlyImages){/if}
		</p>
		<p class="notes">Only creatures that have a token image will be available to summon by default.</p>
	</div>
	<div class="setting">
		<div class="right">
			<input type="checkbox" bind:checked={$autoAccept} />
		</div>
		<p>
			Automatically Accept Summoning Requests {#if debug()}(autoAccept){/if}
		</p>
		<p class="notes">The GM no longer will need to accept a Summoning Request from a Player.</p>
	</div>
	<div class="setting">
		<div class="right">
			<input type="text" bind:value={indexFieldString} class="input" />
		</div>
		<p>
			<i class="fas fa-exclamation-triangle" /> Index Fields {#if debug()}(indexFields){/if}
		</p>
		<p class="notes">
			What fields to index for filtering purposes. Don't modify unless you know what you are doing!
			<br />
			<!-- svelte-ignore a11y-missing-attribute -->
			<a
				style="color: var(--color-text-hyperlink);"
				on:click={setDefaultIndexFields}
				on:keydown={setDefaultIndexFields}
			>
				Return to Default.
			</a>
		</p>
	</div>
	<SystemSpecific {gameSettings} />
</div>

<style lang="scss">
	.settings-box {
		border: none;
		margin: 0.75rem 0.125rem;
		padding: 0.5rem;
		box-shadow: 0 0 4px 0 black;
		background: hsla(0, 0%, 100%, 0.25);
		border-radius: 0.25rem;
	}

	.foundry-summons {
		:global(.input) {
			width: 100%;
			border: 1px solid #5e5e5e;
			border-radius: 0.25rem;
			padding: 0.25rem;
		}

		:global(.system) {
			box-shadow: inset 0 0 0 200px rgba(180, 50, 210, 0.1), 0 0 1rem 10px rgba(180, 50, 210, 0.1);
		}

		:global(.option) {
			box-shadow: revert;
			padding-left: 0.25rem;
			&:hover {
				box-shadow: inset 0 0 0 200px #006cc41c;
			}
		}

		:global(.selected) {
			background-color: #416482;
			color: #fff;
			box-shadow: inset 0 0 0 200px #006bc44d;
		}

		:global(.box) {
			resize: vertical;
			overflow: hidden;
			overflow-y: scroll;
			border: 1px solid #5e5e5e;
			border-radius: 0.25rem;
			min-height: 5rem;
			height: 5rem;
			max-height: 20rem;
		}

		:global(.right) {
			margin-left: 0.5rem;
			float: right;
			clear: right;
			max-width: 200px;
		}

		:global(.setting) {
			overflow: hidden;
			flex-wrap: wrap;
			padding: 0.125rem;
			border-radius: 0.25rem;

			&:hover {
				background-color: #0000000e;
			}
		}
	}
</style>
