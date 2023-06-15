<script>
	import { debug } from '../utils';
	export let gameSettings;

	const noUncommon = gameSettings.getStore('noUncommon');

	$: debug('Uncommon Allowance', $noUncommon);
</script>

<!-- svelte-ignore missing-declaration -->
{#if game.system.id === 'pf2e'}
	<hr />
	<div class="system">
		<h2>System Settings: Pathfinder 2e</h2>
		<div class="setting">
			<div class="right">
				<input type="checkbox" bind:checked={$noUncommon} />
			</div>
			<p>
				Disallow Uncommon and rarer Creatures {#if debug()}(noUncommon){/if}
			</p>
			<p class="notes">Uncommon and rarer options are filtered out of the Summoning Menu.</p>
		</div>
	</div>
	<!-- {:else if game.system.id === 'dnd5e'} -->
{/if}

<style>
	h2 {
		text-align: center;
	}
</style>
