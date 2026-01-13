# VOLT — Game Design Overview

## Core Premise
VOLT follows a sentient energy construct tasked with restoring power to fractured worlds. Each world is governed by a destabilized core and a guardian boss. The game blends tight 2D platforming with occasional pseudo-3D depth sections to vary gameplay and scale.

## Player Mechanics
Volt is a 32×32 pixel cube with a glowing electric border. Gameplay focuses on responsive movement and energy control.

### Movement
- Run, jump, and fall with snappy input buffering and coyote time.
- **Electric Dash**: a short burst that consumes energy.
- **Faux-3D arenas**: limited depth movement using scaling and parallax for illusion.

### Combat Abilities
- **Melee attacks** with precise hit frames and active hitboxes.
- **Volt Blast**: ranged energy projectile.
- **Charge**: stationary ability that refills energy.

### Energy System
- Gradient meter from yellow → red.
- Consumed by dash and ranged attacks.
- Restored via charge or combat rewards.

## Enemies & Bosses
- Standard enemies use state-based AI (idle, patrol, chase, attack).
- Enemies react to hits with stun, knockback, and hitstop.
- Bosses include multi-phase behavior, telegraphed attacks, and arena-locked fights.
- Boss encounters include dialogue before, during, and after battles.

## Progression Systems
### Level & XP
- Enemies grant XP.
- Leveling grants skill points.

### Skill Tree (Ability Modifiers)
- Dash leaves a damaging trail.
- Charged blast pierces enemies.
- Perfect dodge restores energy.

## Worlds
- Five distinct worlds, each with unique mechanics and themes.
- Each world contains multiple enemy types and one boss.
- Worlds are accessed via a fantasy-style world map that shows progression status.

## Story & Cutscenes
- Short, character-driven cutscenes at world entry, boss encounters, and major milestones.
- Animated portraits with dialogue boxes.

## UI & Quality of Life
- Pixel-perfect rendering with integer scaling.
- Pause menu, world map screen, damage numbers.
- Hitstop and optional screen shake.
- Autosave via local storage.

## Settings & Accessibility
- Master, music, and SFX volume controls.
- Toggle screen shake and shader effects.
- Optimization settings (low-FX mode).
- Fully customizable keybindings.
- Pixel scale options.

## Technical Constraints
- All gameplay sprites use 32×32 units or exact multiples.
- Hitboxes are smaller than sprites for fair gameplay.
- Modular JavaScript architecture with no external engines (HTML/CSS/JS only).

## Design Goal
VOLT should feel tight, readable, and expressive. Combat rewards timing and positioning, prioritizing feel and clarity over realism while delivering a polished indie experience.
