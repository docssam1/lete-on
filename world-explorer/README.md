# GFIELD World Explorer

GFIELD World Explorer is an independent game inside LeteOn and is served from `/world-explorer/`.

The launch flow is: intro video → saved explorer-name entry or new explorer creation → character artwork with the “Preparing your world journey” loading screen → 3D village. Explorer names and selected character profiles are local device data, not online accounts.

## Isolation contract

- Do not import code or assets from Geometry World.
- Keep the PWA manifest, service worker, cache names, and offline shell scoped to `/world-explorer/`.
- Keep progress and character data in World Explorer-specific `localStorage` keys.
- Do not register a service worker outside the `/world-explorer/` scope.
- Geometry World and World Explorer must remain independently deployable and uninstallable.

## Current storage and cache namespaces

- Game progress: `gfield-world-explorer-v1`
- Village position: `gfield-world-village-v1`
- Character selection and equipment: `gfield-world-character-v2`
- PWA cache: `gfield-world-explorer-v8`
