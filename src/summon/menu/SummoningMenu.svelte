<svelte:options accessors={true} />

<script>
	import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
	import { writable } from 'svelte/store';
	import loadPacks from './loadPacks.js';
	import { debug, localize, moduleID, deduplicate } from '../../utils.js';
	import defaultFilters from './defaultFilters.js';
	import { getContext, onMount } from 'svelte';
	const { application } = getContext('#external');

	export let elementRoot;
	export let data;

	data = foundry.utils.mergeObject(
		{
			tokens: canvas.tokens.ownedTokens,
			creatures: loadPacks(),
			amount: { value: 1, locked: false },
			filters: defaultFilters(),
			location: null,
			options: {},
		},
		data
	);

	if (data.options.defaultFilters) {
		data.filters.push(...defaultFilters());
		data.filters = deduplicate(data.filters, (filter) => filter.name);
	}

	const token = writable(canvas.tokens.controlled[0] ?? data?.tokens?.[0]);
	const creature = writable();
	const currentFilters = writable(data.filters ?? []);
	const search = writable('');
	const amount = writable(data.amount.value);

	async function send() {
		let location = data.location;

		if (!location) {
			const importedToken = (await fromUuid($creature.uuid)).prototypeToken;

			const crosshairConfig = {
				label: importedToken.name,
				interval: importedToken.height < 1 ? 4 : importedToken.height % 2 === 0 ? 1 : -1,
				lockSize: true,
				drawOutline: false,
				drawIcon: false,
			};

			let crosshairShow;

			if (game.modules.get('sequencer'))
				crosshairShow = {
					show: async (crosshair) => {
						new Sequence('Foundry Summons')
							.effect()
							.file(importedToken.texture.src)
							.attachTo(crosshair)
							.persist()
							.scaleToObject(importedToken.height * importedToken.texture.scaleX)
							.opacity(0.5)
							.play();
					},
				};

			application.minimize();
			const crosshairs = await warpgate.crosshairs.show(crosshairConfig, crosshairShow);
			if (crosshairs.cancelled) {
				application.maximize();
				return;
			}

			location = (
				await canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [
					{
						...crosshairs,
						distance: (importedToken.height / 2) * canvas.scene.grid.distance,
					},
				])
			)[0];
		}

		const options = {
			summonerTokenDocument: $token?.document?.toObject(),
			creatureActor: $creature,
			amount: $amount,
			location,
		};
		debug('Sending', options);
		warpgate.event.notify('fs-summon', options);
		application.close();
	}

	function openImage(actor) {
		new ImagePopout(actor.img, { title: actor.name, uuid: actor.uuid }).render(true);
	}

	function filterCreatures(creatures, filters, search) {
		let filtered = creatures.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()));

		filters
			.filter((x) => !x.disabled || x.locked)
			.forEach((filter) => {
				filtered = filter.function(filtered);
			});

		return filtered;
	}
</script>

<ApplicationShell bind:elementRoot>
	<main>
		<div>
			{#if $currentFilters.length}
				<div>
					<p>Current filters affecting your summon selection:</p>
					{#each $currentFilters
						.sort((b, a) => a.locked ?? false - b.locked ?? false)
						.filter((x) => !x.hidden) as filter}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							class="option"
							class:locked={filter.locked}
							class:disabled={filter.disabled}
							on:click={() => (!filter.locked ? (filter.disabled = !filter.disabled) : filter)}
						>
							{#if filter.locked}
								<span class="fas fa-lock" />
							{/if}
							<span>
								{filter.name}
							</span>
						</div>
					{/each}
				</div>
			{/if}
			<div>
				<label for="token">Select the Summoning Token:</label>
				<select id="token" name="token" type="dropdown" placeholder="Select a Token" bind:value={$token}>
					{#each data.tokens as token}
						<option value={token}>{token.name}</option>
					{/each}
				</select>
			</div>
			<div>
				{#if data.amount.locked}
					<span class="fas fa-lock disabled" />
				{/if}
				<label for="number" class:disabled={data.amount.locked}>How Many Creatures:</label>
				<input type="number" id="number" min="1" bind:value={$amount} disabled={data.amount.locked} />
			</div>
		</div>
		<div>
			<div class="search">
				<input type="text" bind:value={$search} />
			</div>
			<ul>
				{#await data.creatures}
					<p>Loading Creatures...</p>
				{:then creatures}
					{@const filteredCreatures = filterCreatures(creatures, $currentFilters, $search)}
					{#if filteredCreatures.length === 0}
						<p>No creatures found.</p>
					{:else}
						{#each filteredCreatures as opt}
							<li>
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div
									class="option"
									class:selected={$creature?.uuid === opt.uuid}
									on:click={() => ($creature = opt)}
								>
									<img
										src={opt.img}
										alt={opt.name}
										loading="lazy"
										on:keypress={openImage(opt)}
										on:click={openImage(opt)}
									/>
									<p class="name">
										{opt.name}
									</p>
								</div>
							</li>
						{/each}
					{/if}
				{:catch error}
					<p>Something went wrong: {error.message}</p>
				{/await}
			</ul>
		</div>
	</main>
	<button on:click={send} disabled={!$creature}>
		Summon {$creature?.name ? `${$amount} ${$creature?.name}` : ''}
	</button>
</ApplicationShell>

<style lang="scss">
	input,
	select {
		margin: 0.25rem;
		margin-left: 0.5rem;
		min-width: 40%;
		max-width: 40%;
	}

	.disabled {
		opacity: 0.5;
	}

	.search {
		position: sticky;
		top: 0.25rem;
		background: #ffffff40;
		backdrop-filter: blur(10px);
	}

	.name {
		padding: 0.25rem 0;
	}

	.option {
		height: 100%;
		box-shadow: revert;
		&.locked {
			opacity: 0.6;
		}

		&:hover {
			box-shadow: inset 0 0 0 200px #006cc41c;
			&.locked {
				box-shadow: none;
			}
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
