// ==========================================
// Tower Defense Game - Game Engine
// ==========================================

import { GAME_STATE, PLAYER } from './Constants'
import EventBus from './EventBus'
import SceneRenderer from '../ui/SceneRenderer'
import InputHandler from '../ui/InputHandler'
import GameMap from '../map/GameMap'
import WaveManager from '../wave/WaveManager'
import TowerFactory from '../towers/TowerFactory'
import EnemyFactory from '../enemies/EnemyFactory'
import EffectManager from '../effects/EffectManager'

export default class GameEngine {
  constructor(container) {
    this.container = container
    this.state = GAME_STATE.READY
    this.eventBus = new EventBus()

    // Game resources
    this.gold = PLAYER.INITIAL_GOLD
    this.lives = PLAYER.INITIAL_LIVES
    this.score = 0

    // Game objects
    this.towers = []
    this.enemies = []
    this.projectiles = []

    // Subsystems
    this.renderer = null
    this.input = null
    this.gameMap = null
    this.waveManager = null
    this.effectManager = null
    this.towerFactory = null
    this.enemyFactory = null

    // Loop
    this.animationId = null
    this.lastTime = 0
    this.elapsedTime = 0

    // Selected tower for placement/upgrade
    this.selectedTowerType = null
    this.selectedTower = null
    this.placingTower = false

    // Callbacks for Vue
    this.onStateChange = null
    this.onGoldChange = null
    this.onLivesChange = null
    this.onScoreChange = null
    this.onWaveChange = null
    this.onTowerSelect = null

    this._init()
  }

  _init() {
    this.renderer = new SceneRenderer(this.container)
    this.input = new InputHandler(this.renderer, this.container)
    this.gameMap = new GameMap(this.renderer.scene)
    this.towerFactory = new TowerFactory(this.renderer.scene)
    this.enemyFactory = new EnemyFactory(this.renderer.scene)
    this.effectManager = new EffectManager(this.renderer.scene)
    this.waveManager = new WaveManager(this)

    this._setupInputHandlers()
    this._setupEventHandlers()

    // Initial render
    this.renderer.render()
  }

  _setupInputHandlers() {
    this.input.onCellClick = (col, row) => {
      if (this.state !== GAME_STATE.PLAYING) return

      if (this.placingTower && this.selectedTowerType) {
        this._placeTower(col, row)
      } else {
        this._selectTowerAt(col, row)
      }
    }

    this.input.onCellHover = (col, row) => {
      if (this.state !== GAME_STATE.PLAYING) return
      this.gameMap.highlightCell(col, row)
    }

    this.input.onRightClick = () => {
      this._cancelPlacement()
    }

    this.input.onBackgroundClick = () => {
      if (!this.placingTower) {
        this._deselectTower()
      }
    }
  }

  _setupEventHandlers() {
    this.eventBus.on('enemy:reachedBase', () => {
      this.lives -= 1
      this._notifyLivesChange()
      if (this.lives <= 0) {
        this.lives = 0
        this._gameOver()
      }
    })

    this.eventBus.on('enemy:killed', (enemy) => {
      this.gold += enemy.reward
      this.score += enemy.reward * 2
      this._notifyGoldChange()
      this._notifyScoreChange()
    })

    this.eventBus.on('wave:complete', () => {
      this.gold += 20 + this.waveManager.currentWave * 5
      this._notifyGoldChange()
      this._notifyWaveChange()
    })

    this.eventBus.on('wave:allComplete', () => {
      this._victory()
    })
  }

  // ========== Game State Control ==========

  start() {
    this._reset()
    this.state = GAME_STATE.PLAYING
    this.lastTime = performance.now()
    this._notifyStateChange()
    this._notifyGoldChange()
    this._notifyLivesChange()
    this._notifyScoreChange()
    this._notifyWaveChange()
    this._gameLoop()
    // Auto-start first wave
    this.startNextWave()
  }

  pause() {
    this.state = GAME_STATE.PAUSED
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this._notifyStateChange()
  }

  resume() {
    this.state = GAME_STATE.PLAYING
    this.lastTime = performance.now()
    this._notifyStateChange()
    this._gameLoop()
  }

  _reset() {
    this.gold = PLAYER.INITIAL_GOLD
    this.lives = PLAYER.INITIAL_LIVES
    this.score = 0
    this.elapsedTime = 0
    this.selectedTowerType = null
    this.selectedTower = null
    this.placingTower = false

    // Remove all towers
    this.towers.forEach(t => t.destroy())
    this.towers = []

    // Remove all enemies
    this.enemies.forEach(e => e.destroy())
    this.enemies = []

    // Remove all projectiles
    this.projectiles.forEach(p => p.destroy())
    this.projectiles = []

    this.effectManager.clear()
    this.gameMap.reset()
    this.waveManager.reset()
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    this._reset()
    this.input.destroy()
    this.renderer.destroy()
    this.eventBus.clear()
  }

  // ========== Tower Actions ==========

  selectTowerType(type) {
    const stats = this._getTowerStats(type)
    if (!stats) return

    this.selectedTowerType = type
    this.placingTower = true
    this.selectedTower = null

    // Show range preview
    this.gameMap.showPlacementRange(type)
  }

  _placeTower(col, row) {
    if (!this.selectedTowerType) return
    if (!this.gameMap.canBuild(col, row)) return

    const stats = this._getTowerStats(this.selectedTowerType)
    const cost = stats.cost[0]
    if (this.gold < cost) return

    this.gold -= cost
    this._notifyGoldChange()

    const tower = this.towerFactory.create(this.selectedTowerType, col, row)
    this.towers.push(tower)
    this.gameMap.placeTower(col, row, tower)

    this.gameMap.hideRangeCircle()
    this.gameMap.showPlacementRange(this.selectedTowerType)
  }

  upgradeTower(tower) {
    if (!tower || tower.level >= this._getTowerStats(tower.type).cost.length) return

    const stats = this._getTowerStats(tower.type)
    const cost = stats.cost[tower.level] // level is 0-indexed, cost[0]=build, cost[1]=upgrade1, cost[2]=upgrade2
    if (this.gold < cost) return

    this.gold -= cost
    this._notifyGoldChange()
    tower.upgrade()
  }

  sellTower(tower) {
    if (!tower) return

    const stats = this._getTowerStats(tower.type)
    let totalInvested = 0
    for (let i = 0; i <= tower.level; i++) {
      totalInvested += stats.cost[i]
    }
    const refund = Math.floor(totalInvested * 0.6)

    this.gold += refund
    this._notifyGoldChange()

    this.gameMap.removeTower(tower.gridCol, tower.gridRow)
    const index = this.towers.indexOf(tower)
    if (index !== -1) this.towers.splice(index, 1)
    tower.destroy()

    this._deselectTower()
  }

  _selectTowerAt(col, row) {
    const tower = this.gameMap.getTowerAt(col, row)
    if (tower) {
      this.selectedTower = tower
      this.placingTower = false
      this.selectedTowerType = null
      this.gameMap.showTowerRange(tower)
      if (this.onTowerSelect) this.onTowerSelect(tower)
    } else {
      this._deselectTower()
    }
  }

  _deselectTower() {
    this.selectedTower = null
    this.gameMap.hideRangeCircle()
    if (this.onTowerSelect) this.onTowerSelect(null)
  }

  _cancelPlacement() {
    this.placingTower = false
    this.selectedTowerType = null
    this.gameMap.hideRangeCircle()
  }

  _getTowerStats(type) {
    const { TOWER_STATS } = require('./Constants')
    return TOWER_STATS[type]
  }

  // ========== Game Loop ==========

  _gameLoop() {
    if (this.state !== GAME_STATE.PLAYING) return

    this.animationId = requestAnimationFrame(() => this._gameLoop())

    const now = performance.now()
    const dt = Math.min((now - this.lastTime) / 1000, 0.05)
    this.lastTime = now
    this.elapsedTime += dt

    this._update(dt)

    this.renderer.render()
  }

  _update(dt) {
    // Spawn enemies from wave manager
    this.waveManager.update(dt)

    // Update enemies
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i]
      enemy.update(dt, this.gameMap.path)

      if (enemy.reachedEnd) {
        this.enemies.splice(i, 1)
        enemy.destroy()
        this.eventBus.emit('enemy:reachedBase', enemy)
        continue
      }

      if (enemy.isDead) {
        this.enemies.splice(i, 1)
        this.effectManager.createDeathEffect(enemy)
        this.eventBus.emit('enemy:killed', enemy)
        enemy.destroy()
        continue
      }
    }

    // Update towers (find targets, fire)
    this.towers.forEach(tower => {
      const projectile = tower.update(dt, this.enemies)
      if (projectile) {
        this.projectiles.push(projectile)
      }
    })

    // Update projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i]
      const hit = proj.update(dt)

      if (hit) {
        this._handleProjectileHit(proj)
        this.projectiles.splice(i, 1)
        proj.destroy()
        continue
      }

      if (proj.expired) {
        this.projectiles.splice(i, 1)
        proj.destroy()
      }
    }

    // Update effects
    this.effectManager.update(dt)
  }

  _handleProjectileHit(projectile) {
    const { damage, type, tower } = projectile

    if (type === 'cannon') {
      // Splash damage
      const splashRadius = tower.getSplashRadius()
      this.effectManager.createExplosion(projectile.position, splashRadius)

      this.enemies.forEach(enemy => {
        const dist = projectile.position.distanceTo(enemy.mesh.position)
        if (dist <= splashRadius) {
          const factor = 1 - (dist / splashRadius) * 0.5
          enemy.takeDamage(damage * factor)
        }
      })
    } else if (type === 'ice') {
      // Damage + slow
      if (projectile.target && !projectile.target.isDead) {
        projectile.target.takeDamage(damage)
        projectile.target.applySlow(tower.getSlowFactor(), tower.getSlowDuration())
      }
    } else if (type === 'lightning') {
      // Chain lightning
      const chainCount = tower.getChainCount()
      const chainDamageFactor = 0.7
      let targets = this._findChainTargets(projectile.target, chainCount, tower.range)
      let currentDamage = damage

      if (projectile.target && !projectile.target.isDead) {
        projectile.target.takeDamage(currentDamage)
      }

      for (let i = 0; i < targets.length; i++) {
        currentDamage *= chainDamageFactor
        if (!targets[i].isDead) {
          targets[i].takeDamage(currentDamage)
          // Create chain lightning effect
          const from = i === 0 ? projectile.target.mesh.position : targets[i - 1].mesh.position
          this.effectManager.createLightningBolt(from, targets[i].mesh.position)
        }
      }
    } else {
      // Single target (arrow, sniper)
      if (projectile.target && !projectile.target.isDead) {
        projectile.target.takeDamage(damage)
      }
    }

    this.effectManager.createHitEffect(projectile.position, type)
  }

  _findChainTargets(primaryTarget, chainCount, maxRange) {
    const targets = []
    const lastTarget = primaryTarget

    for (let i = 0; i < chainCount; i++) {
      let closest = null
      let closestDist = Infinity

      this.enemies.forEach(enemy => {
        if (enemy === primaryTarget || targets.includes(enemy) || enemy.isDead) return
        const dist = lastTarget.mesh.position.distanceTo(enemy.mesh.position)
        if (dist < closestDist && dist <= maxRange) {
          closestDist = dist
          closest = enemy
        }
      })

      if (closest) {
        targets.push(closest)
      } else {
        break
      }
    }

    return targets
  }

  _gameOver() {
    this.state = GAME_STATE.GAMEOVER
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this._notifyStateChange()
    this.renderer.render()
  }

  _victory() {
    this.state = GAME_STATE.VICTORY
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this._notifyStateChange()
    this.renderer.render()
  }

  // ========== Start Next Wave ==========

  startNextWave() {
    if (this.state === GAME_STATE.PLAYING) {
      this.waveManager.startNextWave()
      this._notifyWaveChange()
    }
  }

  // ========== Notify Callbacks ==========

  _notifyStateChange() {
    if (this.onStateChange) this.onStateChange(this.state)
  }

  _notifyGoldChange() {
    if (this.onGoldChange) this.onGoldChange(this.gold)
  }

  _notifyLivesChange() {
    if (this.onLivesChange) this.onLivesChange(this.lives)
  }

  _notifyScoreChange() {
    if (this.onScoreChange) this.onScoreChange(this.score)
  }

  _notifyWaveChange() {
    if (this.onWaveChange) this.onWaveChange({
      current: this.waveManager.currentWave,
      total: this.waveManager.totalWaves,
      enemiesRemaining: this.waveManager.enemiesRemaining,
      phase: this.waveManager.phase,
    })
  }
}

export { GAME_STATE }
