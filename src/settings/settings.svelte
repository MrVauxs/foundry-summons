<script>
	export let gameSettings;

	console.log(gameSettings.getWritableStore('debug'));
</script>

<div class="settings-header">
	<div class="option">
		<input type="checkbox" id="checkbox" />
		<label for="checkbox"> Hello There! </label>
	</div>
</div>

<style>
	label {
		margin-left: 0.125rem;
		margin-top: 2px;
	}
	.option {
		display: flex;
		align-items: center;
	}
	.settings-header {
		border: none;
		margin: 0.75rem 0.125rem;
		padding: 0.5rem;
		box-shadow: 0 0 4px 0 black;
		background: hsla(0, 0%, 100%, 0.25);
		border-radius: 0.25rem;
	}
</style>
