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
			<ul>
				{#each Array(60) as opt}
					<li>a</li>
				{/each}
			</ul>
		</div>
	</main>
</ApplicationShell>

<style lang="scss">
	main {
		text-align: center;
		display: flex;
		flex-direction: row;
		columns: 2;
		max-height: calc(600px - 2.5rem - 8px);

		div {
			overflow-y: scroll;
			box-shadow: 0 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
			margin: 0.25rem;
			border-radius: 0.25rem;
			width: 50%;

			-ms-overflow-style: none;
			scrollbar-width: none;
			&::-webkit-scrollbar {
				display: none;
			}
		}
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		li {
			height: 40px;
			background: rgba(255, 255, 255, 0.25);
			&:nth-child(odd) {
				background: none;
			}
		}
	}
</style>
