<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
	export let elementRoot;
	export let filters, sources, options;

	console.log(filters, sources, options);
</script>

<ApplicationShell bind:elementRoot>
	<main>
		<div>Hell</div>
		<div>
			Heck
			<p />
			a
		</div>
	</main>
</ApplicationShell>

<style lang="scss">
	main {
		text-align: center;
		display: flex;
		flex-direction: row;
		columns: 2;
		div {
			box-shadow: 0 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
			margin: 0.25rem;
			border-radius: 0.5rem;
			width: 50%;
		}
	}
</style>
