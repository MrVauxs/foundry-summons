<svelte:options accessors={true} />

<script>
	import * as systems from './options/index.js';
	import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
	import { writable } from 'svelte/store';
	import loadPacks from './loadPacks.js';
	import { debug, localize, moduleID, deduplicate } from '../../utils.js';
	import defaultFilters from './defaultFilters.js';
	import defaultSorting from './defaultSorting.js';
	import { getContext } from 'svelte';
	const { application } = getContext('#external');

	export let elementRoot;
	export let ogData;

	let data = foundry.utils.mergeObject(
		{
			sourceTokens: canvas.tokens.ownedTokens,
			creatures: null,
			location: null,
			amount: { value: 1, locked: false },
			filters: [],
			sorting: [
				{
					name: localize('fs.menu.sort.alphabetical'),
					function: (a, b) => a.name.localeCompare(b.name),
				},
			],
			updates: undefined,
			flags: undefined,
			options: {
				defaultFilters: true,
				defaultSorting: true,
			},
		},
		ogData
	);

	if (data.creatures === null) {
		data.creatures = loadPacks();
	}

	if (data.options.defaultFilters) {
		data.filters.push(...defaultFilters());
		data.filters = deduplicate(data.filters, (filter) => filter.name);
	}

	if (data.options.defaultSorting) {
		data.sorting.push(...defaultSorting());
		data.sorting = deduplicate(data.sorting, (sort) => sort.name);
	}

	const token = writable(canvas.tokens.controlled[0] ?? data?.sourceTokens?.[0]);
	const creature = writable();
	const currentFilters = writable(data.filters ?? []);
	const sort = writable(data.sorting[0]);
	const search = writable('');
	const amount = writable(data.amount.value);

	async function send() {
		let location = data.location;

		if (!location) {
			const importedToken = (await $creature.loadDocument()).prototypeToken;

			const crosshairConfig = {
				label: importedToken.name,
				interval: importedToken.height < 1 ? 4 : importedToken.height % 2 === 0 ? 1 : -1,
				lockSize: true,
				radius: importedToken.width,
				drawOutline: debug() || !game.modules.get('sequencer')?.active,
				drawIcon: debug() || !game.modules.get('sequencer')?.active,
				icon: importedToken.texture.src,
			};

			let crosshairShow;

			if (game.modules.get('sequencer')?.active)
				crosshairShow = {
					show: async (crosshair) => {
						new Sequence('Foundry Summons')
							.effect()
							.file(importedToken?.texture?.src ?? $creature.img)
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

			const template = (
				await canvas.scene.createEmbeddedDocuments('MeasuredTemplate', [
					{
						...crosshairs,
						distance: (importedToken.height / 2) * canvas.scene.grid.distance,
					},
				])
			)[0];

			location = { ...template.toObject(), docName: 'MeasuredTemplate', uuid: template.uuid };
		}

		const options = {
			summonerTokenDocument: $token?.document,
			creatureActor: $creature.serialize(),
			amount: $amount,
			location,
			updates: data.updates ?? {},
			flags: data.flags ?? {},
		};
		debug('Sending', options);
		warpgate.event.notify('fs-summon', options);
		application.close();
	}

	if (data.options.autoPick && data.creatures.length === 1) {
		creature.set(data.creatures[0]);
		send();
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

		return filtered.sort((a, b) => $sort.function(a, b));
	}
</script>

<ApplicationShell bind:elementRoot>
	<main>
		<div>
			{#if $currentFilters.length}
				<div>
					<p>{localize('fs.menu.currentFilters')}</p>
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
								{@html filter.name}
							</span>
						</div>
					{/each}
				</div>
			{/if}
			<div>
				<label for="sort">{localize('fs.menu.sortedBy')}</label>
				<select
					id="sort"
					name="sort"
					type="dropdown"
					placeholder="Select the Sorting Method"
					bind:value={$sort}
				>
					{#each data.sorting as method}
						<option value={method}>{method.name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="token">{localize('fs.menu.summonToken')}</label>
				<select id="token" name="token" type="dropdown" placeholder="Select a Token" bind:value={$token}>
					{#each data.sourceTokens as token}
						<option value={token}>{token.name}</option>
					{/each}
				</select>
			</div>
			<div>
				{#if data.amount.locked}
					<span class="fas fa-lock disabled" />
				{/if}
				<label for="number" class:disabled={data.amount.locked}>{localize('fs.menu.howMany')}</label>
				<input type="number" id="number" min="1" bind:value={$amount} disabled={data.amount.locked} />
			</div>
		</div>
		<div class="search-options-box">
			<div class="search">
				<input type="text" bind:value={$search} />
			</div>
			<div>
				<ul>
					{#await data.creatures}
						<p>{localize('fs.menu.loading')}</p>
					{:then creatures}
						{@const filteredCreatures = filterCreatures(creatures, $currentFilters, $search)}
						{#if filteredCreatures.length === 0}
							<p>{localize('fs.menu.nothing')}</p>
						{:else}
							{#each filteredCreatures as opt}
								<li>
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<div
										class="option"
										class:selected={$creature?.id === opt.id}
										on:click={() => ($creature = opt)}
										on:dblclick={send}
									>
										<!-- svelte-ignore missing-declaration -->
										<svelte:component
											this={systems[game.system.id] ? systems[game.system.id] : systems.none}
											creature={opt}
											{openImage}
										/>
									</div>
								</li>
							{/each}
						{/if}
					{:catch error}
						<p>{localize('fs.menu.error', { error: error.message })}</p>
					{/await}
				</ul>
			</div>
		</div>
	</main>
	<button on:click={send} disabled={!$creature}>
		{localize('fs.menu.summon')}
		{$creature?.name ? `${$amount} ${$creature?.name}` : ''}
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

	.search-options-box {
		display: flex;
		flex-direction: column;
	}

	.search {
		min-height: 2.25rem;
		height: 2.25rem;
		max-height: 2.25rem;
		background: url(../ui/parchment.jpg) repeat;

		input {
			height: 1.75rem;
			padding: 0.25rem;
		}
	}

	.option {
		position: relative;
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
		overflow-y: auto;
		box-shadow: 0 0 0.25rem 0.25rem rgba(0, 0, 0, 0.25);
		margin: 0.25rem;
		border-radius: 0.25rem;

		&.option {
			-ms-overflow-style: none;
			scrollbar-width: none;
			&::-webkit-scrollbar {
				display: none;
			}
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
			&:last-child {
				margin-bottom: 0.25rem;
			}
		}
	}
</style>
