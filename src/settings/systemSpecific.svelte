<script>
	import { debug } from '../utils';
	export let gameSettings;

	const noUncommon = gameSettings.getStore('noUncommon');

	$: debug('Uncommon Allowance', $noUncommon);
</script>

<!-- svelte-ignore missing-declaration -->
<h2>System Settings: {game.system.title}</h2>
<!-- svelte-ignore missing-declaration -->
{#if game.system.id === 'pf2e'}
	<div class="setting">
		<div class="right">
			<input type="checkbox" bind:checked={$noUncommon} />
		</div>
		<p>
			Disallow Uncommon and rarer Creatures {#if debug()}(noUncommon){/if}
		</p>
		<p class="notes">Uncommon and rarer options are filtered out of the Summoning Menu.</p>
	</div>
{/if}

<style>
	h2 {
		text-align: center;
	}
</style>
