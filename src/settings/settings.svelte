<script>
	export let gameSettings;

	const sources = gameSettings.getWritableStore('sources');

	$: console.log($sources);
</script>

<div class="settings-header">
	<div class="option">
		<select
			multiple
			id="sources"
			name="sources"
			type="dropdown"
			class="right"
			bind:value={$sources}
			style="resize: vertical; min-height: 5rem; max-height: 20rem;"
		>
			<!-- svelte-ignore missing-declaration -->
			{#each game.packs.contents.filter((pack) => pack.metadata.type === 'Actor') as pack}
				<option value={pack.metadata}>
					{pack.title}
				</option>
			{/each}
		</select>
		<p for="sources">Summoning Sources</p>
		<p class="notes">Select the sources you want to be available in the Summoning Menu.</p>
		<p class="notes"><kbd>Ctrl</kbd> to Select Multiple, <kbd>Shift</kbd> to Select a span of sources.</p>
	</div>
</div>

<style>
	kbd {
		border: 1px solid #ccc;
		padding: 1px;
		background: #eee;
		border-radius: 3px;
	}
	.right {
		margin-left: 0.5rem;
		float: right;
		clear: right;
		max-width: 200px;
		min-width: 150px;
	}
	.option {
		margin: auto;
		overflow: hidden;
		align-items: center;
		flex-wrap: wrap;
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
