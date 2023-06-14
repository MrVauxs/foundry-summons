<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
	import { writable } from 'svelte/store';
	import { debug, localize, moduleID } from '../../utils.js';
	import loadPacks from './components/loadPacks.js';
	import { onMount } from 'svelte';
	export let elementRoot;
	export let data = {
		tokens: [
			{ uuid: 'fake Id', name: 'Test' },
			{ uuid: 'fake Id 2', name: 'Test 2' },
		],
		creatures: [
			{ uuid: 'fake Id', name: 'Test' },
			{ uuid: 'fake Id 2', name: 'Test 2' },
			{ uuid: 'fake Id 3', name: 'Test 3' },
			{ uuid: 'fake Id 4', name: 'Test 4' },
		],
		filters: [],
	};

	$: {
		console.log('Data', data);
		console.log('Token', $token);
		console.log('Creature', $creature);
	}

	onMount(async () => {
		data.creatures = await loadPacks();
	});

	let token = writable(data.tokens[0]);
	let creature = writable('');

	function send(options = { token: $token, creature: $creature }) {
		debug('Sending', options);
		warpgate.event.notify('fs-summon', options);
	}

	function openImage(actor) {
		new ImagePopout(actor.img, { title: actor.name, uuid: actor.uuid }).render(true);
	}
</script>

<ApplicationShell bind:elementRoot>
	<main>
		<div>
			<div>
				<p>Current filters affecting your summon selection:</p>
				{#if data.filters.length === 0}
					<p>None! You have <b>Full Access</b>.</p>
				{/if}
				<ul>
					{#each data.filters as filter}
						<li>{filter}</li>
					{/each}
				</ul>
			</div>
			<div>
				<label for="token">Select the Summoning Token:</label>
				<select id="token" name="token" type="dropdown" placeholder="Select a Token" bind:value={$token}>
					{#each data.tokens as token}
						<option value={token}>{token.name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="number">How Many Creatures:</label>
				<input type="number" id="number" min="1" value="1" />
			</div>
		</div>
		<div>
			<ul>
				{#each data.creatures as opt}
					<li>
						<div
							class="option"
							class:selected={$creature === opt.uuid}
							on:click={() => ($creature = opt.uuid)}
							on:keypress={() => ($creature = opt.uuid)}
						>
							<img src={opt.img} alt={opt.name} loading="lazy" on:click={openImage(opt)} />
							{opt.name}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	</main>
	<button on:click={send}> Submit </button>
</ApplicationShell>

<style lang="scss">
	input,
	select {
		margin: 0.25rem;
		margin-left: 0.5rem;
		min-width: 40%;
		max-width: 40%;
	}

	.option {
		height: 100%;
		box-shadow: revert;
		&:hover {
			box-shadow: inset 0 0 0 200px #006cc41c;
		}

		img {
			clear: left;
			float: left;
			height: 100%;
			width: 50px;
			object-fit: cover;

			box-sizing: border-box;
			border: 1px solid var(--color-border-dark);
			border-radius: 2px;

			&:hover {
				box-shadow: inset 0 0 0 200px #0300c42c;
			}
		}
	}

	.selected {
		background-color: #416482;
		color: #fff;
		box-shadow: inset 0 0 0 200px #006bc44d;
	}

	button {
		margin-top: 0.125rem;
	}

	main {
		text-align: center;
		display: flex;
		flex-direction: row;
		columns: 2;
		min-height: calc(600px - 5rem - 2px);

		& > div {
			width: 50%;
		}
	}

	div {
		overflow-y: scroll;
		box-shadow: 0 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
		margin: 0.25rem;
		border-radius: 0.25rem;

		-ms-overflow-style: none;
		scrollbar-width: none;
		&::-webkit-scrollbar {
			display: none;
		}

		& > div {
			box-shadow: 0 0 0.125rem 0.125rem rgba(0, 0, 0, 0.25);
			margin: 0.25rem;
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
