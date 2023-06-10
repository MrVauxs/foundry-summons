/**
 * This is the main hook that should be called when someone requests a summon.
 */
Hooks.on('conjureActor', (coordinates, actor) => {
	console.log('Conjure Actor');
	warpgate.conjureActor(coordinates, actor);
});
