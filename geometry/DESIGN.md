# Cube Copy Build Design System

## Detailed Korean Game Plan

The implementation-ready plan is split into separate documents so each game can be built and tested independently:

- `docs/00_MASTER_PLAN.md`
- `docs/01_COPY_BUILD.md`
- `docs/02_COUNT_HEIGHTS.md`
- `docs/03_COUNT_HIDDEN.md`
- `docs/04_IMPLEMENTATION_TASKS.md`

## Product Goal

Create a touch-first educational block-building game for young children. The app should feel like a real manipulative: children pick up one cube from a rich pile, drag it to a large placement board, see a red target highlight, and drop it into place.

## Audience

- Early elementary and pre-elementary learners.
- Adults may supervise, but the primary interaction must be understandable without reading long instructions.
- Works in Korean, Chinese, Japanese, and English without changing layout.

## Interaction Principles

- Drag is the primary action.
- The pile is the source of new cubes.
- The 3D building board is the placement target.
- Red highlight means "you can drop here."
- Dragging a placed cube back to the pile removes it.
- The 3D scene is for visual confirmation and rotation, not precision placement.
- During counting mode, cubes can be tapped one by one and fall away.

## Visual Direction

- Warm classroom material, not a dashboard.
- Use soft off-white surfaces, wood-like cube colors, and clear green actions.
- Keep components chunky and tactile.
- Use 8px radius for cards and controls.
- Avoid decorative gradients that overpower the blocks.

## Layout

- Desktop: target model and learner build side by side.
- Mobile portrait: show only a clear landscape-rotation guide with Cubi.
- Mobile landscape: keep target, build board, pile, and controls inside one viewport without page scrolling.
- The target panel uses about 31% of the width and the build panel uses the remaining space.
- Touch targets in the landscape control row must stay at least 44px tall.

## Color Tokens

- Background: `#fff8ec`
- Surface: `#fffdf8`
- Text: `#2f2a24`
- Muted text: `#716b63`
- Primary action: `#2f9c82`
- Primary dark: `#237964`
- Cube wood: `#e9c982`
- Cube shadow: `#b99254`
- Drop highlight: `#df4d4d`
- Drop fill: `#ffd9d9`
- Board fill: `#fffef9`

## Typography

- Use system sans fonts with Korean, Japanese, and Chinese fallback.
- Headings should be bold and friendly, but not oversized inside panels.
- No negative letter spacing.
- Button text must remain readable across all four languages.

## Motion

- Orbit rotation should feel damped and smooth.
- Drag ghost follows the pointer immediately.
- Drop targets highlight within 120ms.
- Falling cubes should visibly drop and rotate.

## Accessibility

- Every board cell has an aria-label containing row, column, and height.
- Language buttons are text labels.
- Status messages use live region.
- Important controls remain keyboard focusable.

## Future Stitch Prompt

Design a touch-first educational 3D cube-building game for young children. The screen has a target cube model and a learner build model, both in soft 3D panels. The learner picks a wooden cube from a rich pile, drags it directly onto the 3D building board, and valid drop positions turn red on the 3D surface. Placed cubes can be dragged from the 3D board back to the pile to remove them. Visual style is warm classroom manipulatives, chunky controls, soft off-white surfaces, wood cube colors, green primary actions, and clear multilingual spacing for Korean, Chinese, Japanese, and English.
