<script>
	export let creature;
	export let openImage;
</script>

<img
	src={creature.img}
	alt={creature.name}
	loading="lazy"
	on:keypress={openImage(creature)}
	on:click={openImage(creature)}
/>
<p class="name">
	{creature.name}
</p>

<style>
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

	.name {
		padding: 0.25rem 0;
	}
</style>
