// ==========================================
// Tower Defense Game - Wave Manager
// ==========================================

import { WAVES } from './WaveData'

export default class WaveManager {
  constructor(gameEngine) {
    this.game = gameEngine
    this.currentWave = 0
    this.totalWaves = WAVES.length
    this.phase = 'waiting' // 'waiting', 'spawning', 'active', 'complete'
    this.spawnQueue = []
    this.spawnTimer = 0
    this.enemiesRemaining = 0
    this.hpMultiplier = 1

    this._prepareQueue()
  }

  _prepareQueue() {
    this.spawnQueue = []
    if (this.currentWave >= WAVES.length) return

    const waveData = WAVES[this.currentWave]
    this.hpMultiplier = 1 + this.currentWave * 0.15 // HP scales with wave

    // Build spawn queue with timing
    let time = 0
    for (const group of waveData.enemies) {
      for (let i = 0; i < group.count; i++) {
        this.spawnQueue.push({
          type: group.type,
          time: time,
          spawned: false,
        })
        time += group.interval
      }
    }

    // Sort by time
    this.spawnQueue.sort((a, b) => a.time - b.time)
    this.enemiesRemaining = this.spawnQueue.length
    this.spawnTimer = 0
  }

  startNextWave() {
    if (this.phase === 'spawning' || this.phase === 'active') return
    if (this.currentWave >= this.totalWaves) return

    this.phase = 'spawning'
    this._prepareQueue()
    this.game._notifyWaveChange()
  }

  update(dt) {
    if (this.phase === 'waiting' || this.phase === 'complete') return

    if (this.phase === 'spawning') {
      this.spawnTimer += dt

      // Spawn enemies whose time has come
      for (const entry of this.spawnQueue) {
        if (entry.spawned) continue
        if (this.spawnTimer >= entry.time) {
          const enemy = this.game.enemyFactory.create(entry.type, this.hpMultiplier)
          this.game.enemies.push(enemy)
          entry.spawned = true
        }
      }

      // Check if all spawned
      const spawnedCount = this.spawnQueue.filter(e => e.spawned).length
      if (spawnedCount === this.spawnQueue.length) {
        this.phase = 'active'
      }
    }

    if (this.phase === 'active') {
      // Check if all enemies are dead or reached base
      if (this.game.enemies.length === 0) {
        this.phase = 'complete'
        this.currentWave++

        // Give wave bonus
        const waveData = WAVES[this.currentWave - 1]
        if (waveData && waveData.bonus) {
          this.game.gold += waveData.bonus
          this.game._notifyGoldChange()
        }

        this.game.eventBus.emit('wave:complete')

        if (this.currentWave >= this.totalWaves) {
          this.game.eventBus.emit('wave:allComplete')
        }
      }
    }

    // Update remaining count
    this.enemiesRemaining = this.game.enemies.length +
      this.spawnQueue.filter(e => !e.spawned).length
  }

  reset() {
    this.currentWave = 0
    this.phase = 'waiting'
    this.spawnQueue = []
    this.spawnTimer = 0
    this.enemiesRemaining = 0
    this.hpMultiplier = 1
  }
}
