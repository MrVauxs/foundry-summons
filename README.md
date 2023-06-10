![template-svelte-esm](https://i.imgur.com/rmfWSrs.jpg)


[![TyphonJS Discord](https://img.shields.io/discord/737953117999726592?label=TyphonJS%20Discord)](https://discord.gg/mnbgN8f)
[![Twitch](https://img.shields.io/twitch/status/typhonrt?style=social)](https://www.twitch.tv/typhonrt)
[![Code Style](https://img.shields.io/badge/code%20style-allman-yellowgreen.svg?style=flat)](https://en.wikipedia.org/wiki/Indent_style#Allman_style)
[![License](https://img.shields.io/badge/license-MIT-yellowgreen.svg?style=flat)](https://github.com/typhonjs-fvtt-demo/template-svelte-esm/blob/main/LICENSE)

Provides a bare-bones Foundry module template repo to get set up with using
[TyphonJS Runtime Library](https://github.com/typhonjs-fvtt-lib/typhonjs) and [Svelte](https://svelte.dev/) on
[Foundry VTT](https://foundryvtt.com/) with ES Modules.

Triple licensed under the [CC0](https://github.com/typhonjs-fvtt-demo/template-svelte-esm/blob/main/LICENSE-CC0), 
[MIT](https://github.com/typhonjs-fvtt-demo/template-svelte-esm/blob/main/LICENSE-MIT), or 
[Unlicense](https://github.com/typhonjs-fvtt-demo/template-svelte-esm/blob/main/LICENSE-UNLICENSE). This repo is 
intended as public domain / freely available starter code that you can use for any project you choose and licensed 
however you see fit with no restrictions.

## About:
Getting started with a new library or development methodology can be difficult. This template repo contains a 
bare-bones setup suitable to start working on your own module. Certainly do check out 
[Essential Svelte (ESM)](https://github.com/typhonjs-fvtt-demo/essential-svelte-esm) for more involved demos that show specific 
concepts available with Svelte and TRL. Please stop by the 
[![TyphonJS Discord](https://img.shields.io/discord/737953117999726592?label=TyphonJS)](https://discord.gg/mnbgN8f)
Discord server to ask any questions.

## Installation (Requires Foundry VTT version 10):
1. Create your version of the template in a new repo by clicking on the "template" button above. In this process rename
the repo to your new module name.
2. Use WebStorm or VSCode to clone your repo into the Foundry VTT data / modules directory (make sure to keep the name
of your repo as the folder installed in your module directory).
3. Modify the module `id` in `module.json` to match your new Foundry package ID.
4. You may of course also change the title of the module in `module.json` to your new module name.
5. In `./vite.config.mjs` update `s_PACKAGE_ID` which references `modules/template-svelte-esm` to your new module ID. 
in step #3 above. Also provide a short unique hash ID for `s_SVELTE_HASH_ID`; suggestion: base it off your package ID.
6. Open in your IDE or via command line and proceed to run `npm install`
7. Run the NPM script `build` to create the production bundle or `dev` to run in developer mode which uses `esbuild` & 
HMR (hot module replacement) to dynamically update your running module in real time for all Svelte related components.   
8. Restart Foundry VTT. This is necessary for Foundry to load the new module.
9. You should now have a new module installed `Template Svelte (ESM)` or whatever title you set in step #4 visible in 
your modules list.
10. Launch a game / world of your choice.
11. Enable your new module under `Manage Modules`.
12. On reload the basic application will appear instantly as it is rendered in the `ready` Foundry hook from the entry 
point: [./src/index.js](https://github.com/typhonjs-fvtt-demo/template-svelte-esm/blob/main/src/index.js)

## What Is Happening Here?
Not a lot as this is a bare-bones setup allowing you to further modify this module to your own liking. It provides
the basic build setup and a "dummy" SvelteApplication instance. The best thing to do is to change your repo name to the 
ID of your new module and update `id` in `module.json` to match your new module ID. 

## About the TyphonJS Runtime Library:
The TyphonJS Runtime Library (TRL) brings an exciting new library resource for all Foundry VTT developers to build
advanced modules and game systems using Svelte. A Svelte UI component library built for Foundry and extensions to the
core Foundry UI / Application framework make it easy to create declarative Svelte based UIs in a method familiar to
Foundry VTT developers. The core UI component framework contains reactive "application shells" that provide an enhanced
ability to control your UI / window experience including intro and outro transitions along with support key UI elements
like context menus and a new backward compatible and API compliant Dialog component that features a modal dialog option.

TRL is innovative as it delivers a runtime library module for Foundry that packages up the runtime in a way that
can be shared across any number of modules / game systems utilizing it thereby saving a lot of space in any given
module or game system. Optionally, it is possible to also bundle TRL directly into your module or game system. The TRL
is both a Foundry library module and an NPM package providing the development dependency utilized for code 
