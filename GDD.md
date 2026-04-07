# CastIt — Game Design Document

## Table of Contents

1. [Game Overview](#1-game-overview)
2. [Core Gameplay Loop](#2-core-gameplay-loop)
3. [Player Mechanics](#3-player-mechanics)
4. [Spell System](#4-spell-system)
5. [Combat System](#5-combat-system)
6. [Enemy Design](#6-enemy-design)
7. [Artefact & Loot System](#7-artefact--loot-system)
8. [Multiplayer](#8-multiplayer)
9. [Progression & Session Flow](#9-progression--session-flow)
10. [Technical Specifications](#10-technical-specifications)
11. [Development Roadmap](#11-development-roadmap)

---

## 1. Game Overview

| Field              | Details                                          |
| ------------------ | ------------------------------------------------ |
| **Title**          | CastIt                                           |
| **Genre**          | First-Person Sorcery PVE (Roguelike Elements)    |
| **Platform**       | Web Browser (WebGL2 / WebGPU)                    |
| **Engine**         | Babylon.js + Havok Physics                       |
| **Team Size**      | 1-3 players (online co-op)                       |
| **Target Audience**| Fans of roguelikes, co-op shooters, fantasy FPS  |

### Elevator Pitch

CastIt is a **first-person co-op sorcery survival game** where 1-3 sorcerers face endless waves of robotic enemies inside a dungeon arena. Each run is unique: loot artefacts from fallen foes to craft powerful spell builds, personalize your magebook, and push for the highest score before inevitable permadeath. A boss awaits every nth wave.

---

## 2. Core Gameplay Loop

```
SPAWN → FIGHT WAVES → LOOT → UPGRADE → BOSS → FIGHT WAVES → ... → DEATH → SCORE
```

### Loop Breakdown

1. **Spawn** — Players spawn in a fight room arena.
2. **Wave Phase** — Robotic enemies spawn in increasing numbers and difficulty.
3. **Loot Phase** — Defeated enemies drop artefacts and resources. Players pick them up to enhance their build.
4. **Boss Encounter** — Every nth wave, a powerful boss appears with unique attack patterns.
5. **Permadeath** — When all sorcerers fall, the run ends. A final score is displayed.

### Design Pillars

- **Mastery through repetition** — Each run teaches players enemy patterns and spell synergies.
- **Build diversity** — Artefact drops force adaptive playstyles every run.
- **Co-op synergy** — Players can specialize (offense/defense) to complement teammates.

---

## 3. Player Mechanics

### 3.1 Movement

| Action        | Description                                      |
| ------------- | ------------------------------------------------ |
| **Walk**      | Standard movement with WASD                       |
| **Sprint**    | Increased movement speed, limited by stamina      |
| **Dash**      | Quick directional dodge with cooldown (i-frame?)  |

### 3.2 Camera

- **First-Person Perspective** — Immersive sorcery experience. Player sees their hands/staff casting spells.

### 3.3 Player Stats (Primitive)

| Stat      | Description                                      |
| --------- | ------------------------------------------------ |
| **HP**    | Health points. Reach 0 = death.                  |
| **Attack**| Base damage modifier for offensive spells.       |

> Future rework may include: Mana, Defense, Speed, Cooldown Reduction.

---

## 4. Spell System

### 4.1 The Magebook

Each sorcerer carries a **magebook** — a customizable spell loadout. Players choose which spells to equip and can upgrade their best spells between runs or during a run via artefacts.

### 4.2 Spell Categories

| Category   | Purpose                        | Examples                          |
| ---------- | ------------------------------ | --------------------------------- |
| **Offense**| Deal damage to enemies         | Fireball, Lightning Bolt, Arcane Blast |
| **Defense**| Protect yourself or allies     | Shield, Heal, Barrier            |

### 4.3 Spell Casting

- Spells are cast via mouse/key inputs (e.g., left click = primary spell, right click = secondary, Q/E = utility).
- Primitive casting: direct projectile or instant effect.
- Future rework: charge mechanics, spell combos, aim-based casting.

### 4.4 Spell Upgrade

- During a run: artefacts can buff specific spells (damage, speed, area of effect).
- Between runs: persistent magebook progression (unlock new spells, upgrade existing ones).

---

## 5. Combat System

### 5.1 Collision & Hitboxes

- **Spell Collisions** — Spells are physical objects or raycasts that collide with enemies/environment.
- **Enemy Hitboxes** — Enemies have defined hitboxes for damage registration.
- **Friendly Fire** — TBD (could add strategic depth in co-op).

### 5.2 Fight Mechanics

| Mechanic              | Description                                      |
| --------------------- | ------------------------------------------------ |
| **Damage Calculation**| Base spell damage × Attack stat × artefact mods  |
| **Enemy Collisions**  | Enemies deal contact damage to players           |
| **Knockback**         | Physical force applied on hit (Havok physics)    |
| **Status Effects**    | Future: Burn, Freeze, Stun, Slow                 |

---

## 6. Enemy Design

### 6.1 Enemy Archetypes

| Type              | Behavior                               | Threat Level |
| ----------------- | -------------------------------------- | ------------ |
| **Swarm Drone**   | Fast, low HP, attacks in groups        | Low          |
| **Brute Bot**     | Slow, high HP, heavy melee attacks     | Medium       |
| **Ranged Turret** | Stationary, shoots projectiles         | Medium       |
| **Elite Unit**    | Mixed abilities, higher stats          | High         |
| **Boss**          | Appears every nth wave, unique patterns| Very High    |

### 6.2 Enemy Intelligence (AI)

- **Primitive AI**: Enemies move toward nearest player and attack on contact.
- **Reworked AI**: Pathfinding, attack pattern variety, retreat behavior, focus-fire on low-HP targets.

### 6.3 Boss Mechanics

- Appears every nth wave (configurable, e.g., every 5th wave).
- Unique attack patterns (AOE, summon minions, charge attacks).
- Scaled stats based on wave number.

---

## 7. Artefact & Loot System

### 7.1 Primitive System (MVP)

- Enemies drop artefacts on death.
- Artefacts are picked up by walking over them.
- Artefacts provide passive stat boosts or spell modifiers.

### 7.2 Reworked System (Future)

| Feature           | Description                                      |
| ----------------- | ------------------------------------------------ |
| **Drop Tables**   | Different enemies drop different artefact tiers   |
| **Currency**      | Enemies drop currency for a shop                  |
| **Shop**          | Between-wave shop to buy/sell artefacts           |
| **Rarity Tiers**  | Common, Rare, Epic, Legendary                     |
| **Synergies**     | Certain artefact combinations unlock bonus effects|

### 7.3 Roguelike Build Crafting

Each run forces players to adapt their build based on what drops. No two runs are identical.

---

## 8. Multiplayer

### 8.1 Co-op Structure

- **1-3 Players** in a shared arena.
- Players share the fight room but have individual magebooks and loot.
- Revive mechanic TBD (downed players can be revived by teammates?).

### 8.2 Networking Considerations

- Babylon.js multiplayer via WebSocket or WebRTC.
- Server-authoritative enemy spawning and damage validation.
- Client-side prediction for player movement and spell casting.

### 8.3 Bonus Features

| Feature                     | Description                          |
| --------------------------- | ------------------------------------ |
| **Proximity Voice Chat**    | Spatial audio based on player distance |
| **Vocally Enabled Casting** | Speak spell names to cast them       |

---

## 9. Progression & Session Flow

### 9.1 Single Run Flow

```
Wave 1 → Wave 2 → ... → Wave N (Boss) → Wave N+1 → ... → Wave 2N (Boss) → ... → DEATH
```

### 9.2 Scoring

- Points awarded per enemy kill.
- Bonus points for boss kills.
- Multipliers for streaks, speed, or style.
- Final score displayed on death.

### 9.3 Between-Run Progression (Future)

- Meta-currency earned from runs.
- Unlock new spells for the magebook.
- Unlock new artefacts in the drop pool.
- Cosmetic unlocks (robes, staffs, spell effects).

---

## 10. Technical Specifications

| Component         | Technology                          |
| ----------------- | ----------------------------------- |
| **Engine**        | Babylon.js                          |
| **Language**      | TypeScript                          |
| **Physics**       | Havok Physics (WebAssembly)         |
| **Rendering**     | WebGL2 (primary), WebGPU (target)   |
| **Build Tool**    | Vite                                |
| **Target**        | Modern browsers (Chrome, Firefox, Edge) |

### Performance Targets

- 60 FPS with 3 players + 20 enemies on screen.
- Graceful degradation to WebGL2 if WebGPU unavailable.

---

## 11. Development Roadmap

Each milestone is a **vertical slice** — a shippable, playable increment. Ship every week.

> **M4 is the MVP** — everything before is scaffolding, everything after is depth.

```
M1 (cast) → M2 (kill) → M3 (fight) → M4 (survive) → M5 (master) → M6 (outsmart)
                                                                       ↓
M8 (loot) ← M7 (variety) ←────────────────────────────────────────────┘
    ↓
M9 (co-op) → M10 (economy) → M11 (spectacle) → M12 (ship)
```

---

### M1 — "Hello World Caster" (Week 1)

**Features:**
- [x] Moveable Body
- [x] 1st Person Camera
- [ ] Primitive Specs (HP + Attack)
- [ ] Object & Spell Collisions
- [ ] Primitive Spells (1 projectile)
- [ ] Primitive Spell Casting (click-to-fire)

**Demo State:** A grey box room. Player moves with WASD, looks with mouse. Left-click fires a glowing projectile that hits the far wall with a particle impact. A floating HP number on the HUD. The player can walk, look, and cast.

**Key Decision:** What's the projectile speed and feel? (Tune in-engine)

---

### M2 — "The Training Dummy" (Week 2)

**Features:**
- [ ] Fight Room Model (basic arena)
- [ ] Enemy Model (placeholder cube/robot)
- [ ] Primitive Fight Mechanics (hitbox, collision damage, enemy HP)
- [ ] Sprint
- [ ] Dash

**Demo State:** Walled arena. A stationary cube "enemy" sits in the center with an HP bar. Player can sprint (Shift) and dash (Space). Firing spells drains enemy HP. When HP hits 0, the cube shatters with a particle effect.

**Key Decision:** Dash — i-frames or not? (See Open Question 1.3)

---

### M3 — "The Enemy Strikes Back" (Week 3)

**Features:**
- [ ] Primitive Enemy Intelligence (chase + attack on contact)
- [ ] Permadeath (player death → respawn)

**Demo State:** Enemy walks toward the player. Contact deals damage (screen flash + HP reduction). On death, "YOU DIED" screen with respawn button. **First real fight** — player is dodging, casting, killing, and can die.

**Key Decision:** Enemy contact damage formula? (See Open Question 3.6)

---

### M4 — "The Gauntlet" (Week 4) — **MVP**

**Features:**
- [ ] Enemy Spawning (wave system)
- [ ] Game Course (waves until death)
- [ ] Score (kill counter + final score)

**Demo State:** Player spawns → Wave 1 (3 enemies) → Wave 2 (5 enemies) → Wave 3 (7 enemies) → escalation continues until death. Score counter tracks kills. Game Over screen shows: Waves survived, Enemies killed, Final Score, Restart button.

**Key Decision:** Wave scaling — linear or exponential? (See Open Question 6.5)

---

### M5 — "Better Spells, Better Stats" (Week 5)

**Features:**
- [ ] Rework Specs (add Mana, Defense, Speed)
- [ ] Rework Spells (3–5 spells: offense + defense)
- [ ] Rework Spell Casting (cooldowns, mana cost, secondary spell keybinds)

**Demo State:** Mana bar alongside HP. Three spell slots: Left-click (fireball), Right-click (shield), Q (lightning bolt). Mana regenerates over time. Cooldowns visible on HUD. Player must manage mana — can't spam. Improved particles, screen shake, distinct audio per spell.

**Key Decision:** Mana regen rate — fast (spammy) or slow (tactical)?

---

### M6 — "Smarter Foes" (Week 6)

**Features:**
- [ ] Rework Fight Mechanics (knockback, contact damage tuning, hit feedback)
- [ ] Rework Enemy Intelligence (pathfinding, attack variety, retreat behavior)

**Demo State:** Enemies pathfind around obstacles. Different behaviors: some rush aggressively, some circle at range, some retreat when low HP. Enemies stagger on hit, knockback via physics. Combat feels like a dance, not a collision test.

**Key Decision:** Which enemy behaviors per type? (Write behavior tree)

---

### M7 — "The Monster Zoo" (Week 7)

**Features:**
- [ ] Enemy Variety (3 distinct enemy types)
- [ ] Rework Enemy Models (distinct visuals per type)
- [ ] Rework Models (player hands/staff, arena art pass)

**Demo State:** Arena has enemy *types*:
- **Swarm Drone:** Fast, low HP, attacks in packs (3–5 spawn together)
- **Brute Bot:** Slow, high HP, heavy melee hit
- **Ranged Turret:** Stationary, shoots projectiles

Each has distinct model/color. Player sees hands/staff in first person. Arena has basic environmental art. Waves mix types — wave 5 might be 4 drones + 1 brute.

**Key Decision:** Art direction locked? Low-poly? Stylized?

---

### M8 — "Loot Drop" (Week 8)

**Features:**
- [ ] Primitive Artefact System (enemy drop + pickup + passive effect)

**Demo State:** Enemies drop glowing artefact orbs on death. Walk over to auto-pickup. Simple inventory sidebar shows 1–3 artefacts with effects ("+10% Spell Damage," "+20 Max HP," "-1s Dash Cooldown"). Effects apply immediately. Artefacts lost on permadeath. ~30% drop rate per enemy.

**Key Decision:** Drop rate per enemy type? (See Open Question 7.2)

---

### M9 — "Together We Stand" (Week 9)

**Features:**
- [ ] Multiplayer (2–3 player co-op, shared arena)

**Demo State:** 2–3 players join via simple lobby/code. See each other as first-person bodies with staffs. Enemies target nearest player. Kills shared. Score per-player. Dead players spectate until team wipe. Waves scale with player count (+20% enemies per extra player).

**Key Decision:** WebSocket vs WebRTC? (See Open Question 8.1) — **biggest technical risk**

---

### M10 — "The Arcane Shop" (Week 10)

**Features:**
- [ ] Rework Artefact System (currency + shop between waves)

**Demo State:** Enemies drop gold alongside artefacts. Between waves: 15-second "SHOP PHASE" — 3 artefacts for sale at varying prices. Buy with gold or save. Skip button to end early. Artefacts range Common → Rare. Forces risk/reward decisions every few waves.

**Key Decision:** Shop inventory — random or curated?

---

### M11 — "Voice of Power" (Week 11)

**Features:**
- [ ] Proximity Voice Chat (spatial audio)
- [ ] Vocally Enabled Spell Casting (speak spell names to cast)

**Demo State:** Players hear each other with spatial falloff. "Vocal Cast" mode: speak spell names ("Fireball!" / "Shield!") to trigger spells. Voice icon shows who's speaking. Cooldown prevents spam. Togglable in settings.

**Key Decision:** Voice recognition — Web Speech API or external service?

---

### M12 — "The Dungeon Awakens" (Week 12) — **Ship Candidate**

**Features:**
- [ ] Lore (environmental storytelling, narrative context)
- [ ] Refine Game (bug fixes, balance pass, polish)

**Demo State:** Arena has environmental lore: inscriptions, narrated intro, boss dialogue. Between-run lore entries unlock at higher waves. Balanced damage numbers, tuned wave pacing, fixed edge cases, 60 FPS with 3 players + 20 enemies. **Feature-complete and polished.**

---

### Feature-to-Milestone Mapping

| Feature | Milestone |
|---------|-----------|
| Moveable Body | M1 |
| 1st Person Camera | M1 |
| Primitive Specs | M1 |
| Spell Collisions | M1 |
| Primitive Spells | M1 |
| Primitive Spell Casting | M1 |
| Fight Room Model | M2 |
| Enemy Model | M2 |
| Primitive Fight Mechanics | M2 |
| Sprint | M2 |
| Dash | M2 |
| Primitive Enemy Intelligence | M3 |
| Permadeath | M3 |
| Enemy Spawning | M4 |
| Game Course | M4 |
| Score | M4 |
| Rework Specs | M5 |
| Rework Spells | M5 |
| Rework Spell Casting | M5 |
| Rework Fight Mechanics | M6 |
| Rework Enemy Intelligence | M6 |
| Enemy Variety | M7 |
| Rework Enemy Models | M7 |
| Rework Models | M7 |
| Primitive Artefact System | M8 |
| Multiplayer | M9 |
| Rework Artefact System | M10 |
| Proximity Voice Chat | M11 |
| Vocally Enabled Casting | M11 |
| Lore | M12 |
| Refine Game | M12 |

---

## 12. Open Questions

The following design decisions remain unresolved and must be answered before or during development of their respective phases.

### General

| # | Question | Impact |
|---|----------|--------|
| G1 | **Roguelike or Roguelite?** — Does anything persist between runs (spell unlocks, meta-currency)? Or is every run a fresh start? | Defines entire progression system |
| G2 | **Expected run duration?** — 5 min? 20 min? 60 min? | Affects wave count, enemy scaling, pacing |
| G3 | **Art direction?** — Low-poly? Realistic? Stylized? Fantasy-tech blend? | Affects all visual assets |
| G4 | **Mana / Resource system?** — Is casting limited by cooldowns only, or is there a mana/resource bar? How is spell spam prevented? | Core to combat feel |
| G5 | **HUD elements?** — HP bar, mana bar, cooldown indicators, wave counter, score, enemy health bars, floating damage numbers? | UI/UX scope |
| G6 | **Difficulty curve?** — What wave should a new player reach on first run? What's the elite ceiling? Linear or exponential scaling? | Tuning philosophy |
| G7 | **Tutorial / Onboarding?** — Training room? Tutorial wave? Tooltips? How does a first-time player learn the game? | New player experience |

### Phase 1 — Movement & Camera

| # | Question |
|---|----------|
| 1.1 | What is walk speed (units/sec)? |
| 1.2 | What is sprint speed multiplier? Is there a stamina bar? Max stamina, regen rate? |
| 1.3 | **Does dash grant invulnerability frames (i-frames)?** |
| 1.4 | What is dash distance, duration, and cooldown? |
| 1.5 | Camera height from ground? Field of view (FOV)? Head bob? |
| 1.6 | Wall collision — slide along wall or stop dead? |

### Phase 2 — Primitive Combat

| # | Question |
|---|----------|
| 2.1 | Starting HP and Attack values? |
| 2.2 | How many spells ship in Phase 2? Which ones specifically (names + behaviors)? |
| 2.3 | Full input binding list — which keys map to which spells/actions? |
| 2.4 | Spell casting: click-to-fire? Hold-to-charge? What's the visual feedback? |
| 2.5 | Cooldown values per spell? Or is mana the limiter? |
| 2.6 | What are the mechanical differences between offense spells (Fireball vs Lightning Bolt vs Arcane Blast)? |
| 2.7 | Are Shield and Barrier different spells? How? |

### Phase 3 — Fight Room & Enemies

| # | Question |
|---|----------|
| 3.1 | Arena dimensions? Layout — open field, corridors, multiple levels? |
| 3.2 | Where do enemies spawn? Fixed points? Random? Minimum distance from players? |
| 3.3 | How many enemy types in Phase 3? All 5 archetypes or just 2-3? |
| 3.4 | Enemy stats (HP, damage, speed) for each type? |
| 3.5 | Enemy AI behavior tree — just "move toward player, attack on contact"? |
| 3.6 | Does player take damage from enemy contact? What's the contact damage formula? |

### Phase 4 — Game Loop (MVP Playable)

| # | Question |
|---|----------|
| 4.1 | What is **n** for boss waves? Every 5th? 10th? |
| 4.2 | What makes a boss different from regular enemies? HP multiplier? Unique attacks? |
| 4.3 | Score formula — points per enemy type? Boss bonus value? Multiplier thresholds? |
| 4.4 | Death screen — what's shown? Score breakdown? Restart button? Delay before restart? |
| 4.5 | How does a wave end — all enemies dead? Timer? |
| 4.6 | Is there a rest period between waves? How long? |
| 4.7 | What's a "streak" for score multiplier? Kills without getting hit? Time-based? |

### Phase 5 — Combat & Systems Rework

| # | Question |
|---|----------|
| 5.1 | What specifically changes from Phase 2? Everything or targeted improvements? |
| 5.2 | New spells added, or just rebalancing existing ones? |
| 5.3 | What does "AI rework" add — pathfinding? Behavior trees? Specific behaviors (retreat, focus-fire)? |
| 5.4 | Success criteria — "feels right" or quantitative targets? |

### Phase 7 — Artefact System

| # | Question |
|---|----------|
| 7.1 | How many artefacts exist? What are they (name + effect)? |
| 7.2 | Drop rate — every enemy? Percentage? Weighted by enemy type? |
| 7.3 | Inventory — how many artefacts can you hold? Stack limit? |
| 7.4 | Pickup — auto on proximity? Manual? Range? |
| 7.5 | Which stats can artefacts modify? HP, Attack, Speed, Cooldown Reduction, all? |
| 7.6 | Are artefacts lost on death? (Presumably yes — permadeath.) |

### Phase 8 — Multiplayer

| # | Question |
|---|----------|
| 8.1 | **WebSocket or WebRTC?** — Fundamental architecture decision. |
| 8.2 | Dedicated server or player-hosted (P2P)? |
| 8.3 | Tick rate? Latency budget? |
| 8.4 | Loot rules — per-player drops? Shared pool? Free-for-all pickup? |
| 8.5 | **Revive mechanic** — can downed players be revived? How? Duration? Interruptible? |
| 8.6 | Player disconnect — bot takeover? Reduced difficulty? Nothing? |
| 8.7 | Can players join mid-run? Or only from lobby? |
| 8.8 | Does difficulty scale with player count? |
| 8.9 | What does a dead player do before team wipe? Spectate? Respawn next wave? |
| 8.10 | Spell casting latency — client-authoritative for feel, server-authoritative for damage? |

### Phase 9 — Lore

| # | Question |
|---|----------|
| 9.1 | Does lore affect gameplay (enemy weaknesses, spell synergies) or is it flavor only? |
| 9.2 | How is lore delivered? Item descriptions? Voiceover? Collectibles? Environmental storytelling? |

---

## Appendix

### Glossary

| Term         | Definition                                        |
| ------------ | ------------------------------------------------- |
| **Magebook** | Player's personal spell loadout                   |
| **Artefact** | Loot item providing stat boosts or spell modifiers|
| **Wave**     | A timed group of enemies spawning in the arena    |
| **Run**      | A single play session from spawn to permadeath    |

---

*This is a living document. Update as development progresses and design decisions evolve.*
