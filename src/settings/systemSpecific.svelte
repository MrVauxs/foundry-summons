<script>
	import { debug } from '../utils';
	import { selectDefaultSources } from './settings.js';
	export let gameSettings;

	const uncommonAllowance = gameSettings.getStore('uncommonAllowance');

	$: debug('Uncommon Allowance', $uncommonAllowance);
</script>

<!-- svelte-ignore missing-declaration -->
<h2>System Settings: {game.system.title}</h2>
<!-- svelte-ignore missing-declaration -->
{#if game.system.id === 'pf2e'}
	<div class="setting">
		<div class="right">
			<input type="checkbox" bind:checked={$uncommonAllowance} />
		</div>
		<p>Disallow Uncommon and rarer Creatures</p>
		<p class="notes">Uncommon and rarer options are filtered out of the Summoning Menu.</p>
	</div>
{/if}

<style>
	h2 {
		text-align: center;
	}
</style>
