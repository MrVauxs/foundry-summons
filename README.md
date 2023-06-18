# Foundry Summons

![](https://img.shields.io/endpoint?url=https%3A%2F%2Ffoundryshields.com%2Fversion%3Fstyle%3Dflat%26url%3Dhttps%3A%2F%2Fraw.githubusercontent.com%2FMrVauxs%2Ffoundry-summons%2Fmain%2Fmodule.json)
![All Downloads](https://img.shields.io/github/downloads/MrVauxs/foundry-summons/total?color=purple&label=All%20Downloads)
![Latest Version Downloads](https://img.shields.io/github/downloads/MrVauxs/foundry-summons/latest/total?color=purple&label=Latest%20Version%20Downloads&sort=semver)
[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ffoundry-summons&colorB=4aa94a)](https://forge-vtt.com/bazaar#package=pf2e-jb2a-macros)
[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ffoundry-summons%2Fshield%2Fendorsements)](https://www.foundryvtt-hub.com/package/foundry-summons/)

An all-in-one solution to all your summoning needs with NO need to import Actors to place them on the map!

Easily expandable with Hooks, and system-inclusive. Should work on any system. 
Just grab the **macro** from the compendium and start summoning!

Built in Svelte using TyphonJS Framework for Foundry.

### Hooks
| Hook | Purpose | Code |
| :--: | :-----: | :--: |
| fs-pre-summon | Gets called before the token is summoned, allowing you to modify it before being put on the board | [Link](https://github.com/MrVauxs/foundry-summons/blob/8eb1315c8da299f33d492b90f61b0645eadef479/src/summon/summon.js#L124) |
| fs-post-summon | Gets called after the token is summoned, allowing you to create your own entrance animations as the token starts off invisible | [Link](https://github.com/MrVauxs/foundry-summons/blob/8eb1315c8da299f33d492b90f61b0645eadef479/src/summon/summon.js#LL156C3-L156C3) | 
| fs-loadingPacks | Gets called when creating the creature index, allowing you to add your own custom data to it | [Link](https://github.com/MrVauxs/foundry-summons/blob/8eb1315c8da299f33d492b90f61b0645eadef479/src/summon/menu/loadPacks.js#L68) |
