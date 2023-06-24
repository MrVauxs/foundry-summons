<script>
	export let openImage;
	export let creature;

	function alignmentStringToTraits(alignment) {
		// returns an array of traits for the alignment string
		// e.g. "LG" -> ["lawful", "good"]

		let traits = [];
		if (alignment.includes('L')) traits.push('lawful');
		if (alignment.includes('N')) traits.push('neutral');
		if (alignment.includes('C')) traits.push('chaotic');
		if (alignment.includes('G')) traits.push('good');
		if (alignment.includes('E')) traits.push('evil');
		return traits;
	}
</script>

<div class="level" data-tooltip="PF2E.Level{creature.system.details.level.value}">
	{creature.system.details.level.value}
</div>
<img
	src={creature.img}
	alt={creature.name}
	loading="lazy"
	on:keypress={openImage(creature)}
	on:click={openImage(creature)}
/>
<div class="name">
	{creature.name}
</div>
<div class="traits tags width">
	{#each alignmentStringToTraits(creature.system.details.alignment.value) as trait}
		<span class="tag alignment">
			{trait}
		</span>
	{/each}
	{#each creature.system.traits.value as trait}
		<span class="tag">
			{trait}
		</span>
	{/each}
</div>

<style>
	.width {
		width: 18rem;
	}

	.alignment {
		background-color: var(--secondary);
	}

	img {
		clear: left;
		float: left;
		height: 100%;
		width: 50px;
		object-fit: cover;
		object-position: top;

		box-sizing: border-box;
		border: 1px solid var(--color-border-dark);
		border-radius: 2px;

		&:hover {
			box-shadow: inset 0 0 0 200px #0300c42c;
		}
	}

	.level {
		position: absolute;
		right: 0.125rem;
		font-size: 2rem;
	}

	.name {
		padding: 0.125rem 0;
	}

	.traits {
		justify-content: center;
	}
</style>
