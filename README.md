[中文文档](./README.zh-CN.md)

# Castle Defense - 3D Tower Defense Game

A 3D tower defense game built with **Vue 2** and **Three.js**. Players strategically place and upgrade defense towers to repel waves of enemies across a 3D battlefield. The game features a cyberpunk-styled UI with glass-morphism effects and immersive 3D rendering.

## Features

- **5 Unique Tower Types** - Each with distinct attack mechanics and 3 upgrade levels:
  - **Arrow Tower** - Fast single-target attacks
  - **Cannon Tower** - Area-of-effect splash damage
  - **Ice Tower** - Slows enemy movement speed
  - **Lightning Tower** - Chain lightning that hits multiple targets
  - **Sniper Tower** - Long range, high single-target damage

- **5 Enemy Types** with scaling difficulty:
  - **Soldier** - Standard ground unit
  - **Scout** - Fast but fragile
  - **Tank** - High HP, slow movement
  - **Flyer** - Airborne unit that travels above ground
  - **Boss** - Massive HP pool, appears in later waves

- **20 Waves** of increasing difficulty, with HP scaling per wave and Boss encounters at waves 10, 15, and 20

- **Full 3D Battlefield** powered by Three.js - terrain, environment dressing, particle effects, and projectile animations

- **Strategic Economy** - Earn gold by killing enemies, manage resources for tower placement, upgrades, and selling (60% refund)

- **Camera Controls** - Orbit, zoom, and rotate the battlefield for the best tactical view

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Vue 2 |
| 3D Rendering | Three.js |
| Build Tool | Vue CLI 5 |
| Deployment | Vercel |

## Project Structure

```
src/
  game/
    core/          # GameEngine, EventBus, ObjectPool, Constants
    map/           # GameMap, Grid, Path
    towers/        # Tower base class, ArrowTower, CannonTower, IceTower, LightningTower, SniperTower, TowerFactory
    enemies/       # Enemy base class, NormalEnemy, FastEnemy, TankEnemy, FlyingEnemy, BossEnemy, EnemyFactory
    projectiles/   # Projectile, Arrow, Cannonball, IceShard, Lightning, SniperBullet
    effects/       # EffectManager, Explosion, Particle, Aura
    wave/          # WaveManager, WaveData (20 wave definitions)
    ui/            # SceneRenderer, InputHandler
  components/
    TowerDefense.vue  # Main game component
    HUD.vue           # In-game heads-up display
    TowerPanel.vue    # Tower selection/upgrade panel
    StartScreen.vue   # Title screen
    GameOverScreen.vue# Game over / victory screen
  App.vue             # Root component
```

## Getting Started

### Prerequisites

- Node.js >= 14
- npm >= 6

### Install

```bash
npm install
```

### Development

```bash
npm run serve
```

### Production Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## How to Play

| Control | Action |
|---------|--------|
| Left Click (on grid) | Place tower / Select existing tower |
| Right Click | Cancel tower placement |
| ESC | Pause / Resume |
| Mouse Drag | Rotate camera |
| Scroll | Zoom in/out |

- Start with **250 gold** and **20 lives**
- Select a tower type from the side panel, then click on a green-highlighted grid cell to place it
- Click an existing tower to see its range, upgrade it, or sell it
- Survive all 20 waves to win
