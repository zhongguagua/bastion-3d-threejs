<template>
  <div class="tower-defense" @click.self="focusContainer">
    <!-- Three.js canvas -->
    <div ref="gameContainer" class="game-container"></div>

    <!-- HUD -->
    <HUD
      v-if="gameState === 'playing' || gameState === 'paused'"
      :gold="gold"
      :lives="lives"
      :score="score"
      :wave="waveInfo"
      @pause="togglePause"
      @startWave="startNextWave"
    />

    <!-- Tower Panel -->
    <TowerPanel
      v-if="gameState === 'playing' || gameState === 'paused'"
      :gold="gold"
      :selectedTower="selectedTower"
      @select-type="selectTowerType"
      @upgrade="upgradeTower"
      @sell="sellTower"
    />

    <!-- Start Screen -->
    <StartScreen
      v-if="gameState === 'ready'"
      class="start-screen-mount"
      @start="startGame"
    />

    <!-- Pause Overlay -->
    <div v-if="gameState === 'paused'" class="overlay pause-overlay">
      <div class="overlay-content">
        <h2>Game Paused</h2>
        <p>Current Wave: {{ waveInfo.current + 1 }}</p>
        <button class="btn-resume" @click="togglePause">Resume</button>
        <p class="hint">Press ESC to resume</p>
      </div>
    </div>

    <!-- Game Over Screen -->
    <GameOverScreen
      v-if="gameState === 'gameover'"
      :score="score"
      :wave="waveInfo.current"
      :victory="false"
      @restart="startGame"
    />

    <!-- Victory Screen -->
    <GameOverScreen
      v-if="gameState === 'victory'"
      :score="score"
      :wave="waveInfo.current"
      :victory="true"
      @restart="startGame"
    />
  </div>
</template>

<script>
import GameEngine, { GAME_STATE } from '../game/core/GameEngine'
import HUD from './HUD.vue'
import TowerPanel from './TowerPanel.vue'
import StartScreen from './StartScreen.vue'
import GameOverScreen from './GameOverScreen.vue'

export default {
  name: 'TowerDefense',
  components: { HUD, TowerPanel, StartScreen, GameOverScreen },
  data() {
    return {
      gameState: GAME_STATE.READY,
      gold: 0,
      lives: 0,
      score: 0,
      waveInfo: { current: 0, total: 20, enemiesRemaining: 0, phase: 'waiting' },
      selectedTower: null,
      game: null,
    }
  },
  mounted() {
    this.initGame()
    this._onKeyDown = (e) => {
      if (e.code === 'Escape') {
        e.preventDefault()
        this.togglePause()
      }
    }
    window.addEventListener('keydown', this._onKeyDown)
  },
  beforeDestroy() {
    if (this.game) this.game.destroy()
    window.removeEventListener('keydown', this._onKeyDown)
  },
  methods: {
    initGame() {
      this.game = new GameEngine(this.$refs.gameContainer)

      this.game.onStateChange = (state) => { this.gameState = state }
      this.game.onGoldChange = (gold) => { this.gold = gold }
      this.game.onLivesChange = (lives) => { this.lives = lives }
      this.game.onScoreChange = (score) => { this.score = score }
      this.game.onWaveChange = (info) => { this.waveInfo = info }
      this.game.onTowerSelect = (tower) => { this.selectedTower = tower }
    },

    startGame() {
      if (this.game) this.game.start()
    },

    togglePause() {
      if (!this.game) return
      if (this.game.state === GAME_STATE.PLAYING) {
        this.game.pause()
      } else if (this.game.state === GAME_STATE.PAUSED) {
        this.game.resume()
      }
    },

    selectTowerType(type) {
      if (this.game) {
        this.game.selectTowerType(type)
      }
    },

    startNextWave() {
      if (this.game) {
        this.game.startNextWave()
      }
    },

    upgradeTower() {
      if (this.game && this.selectedTower) {
        this.game.upgradeTower(this.selectedTower)
      }
    },

    sellTower() {
      if (this.game && this.selectedTower) {
        this.game.sellTower(this.selectedTower)
      }
    },

    focusContainer() {
      this.$el.focus()
    },
  },
}
</script>

<style scoped>
.tower-defense {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #1a2a3a;
  outline: none;
}

.game-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  pointer-events: none;
}

.overlay > * {
  pointer-events: auto;
}

.start-screen-mount {
  z-index: 20;
  pointer-events: auto !important;
}

.pause-overlay {
  background: rgba(2, 5, 15, 0.9);
  backdrop-filter: blur(16px);
}

.overlay-content {
  text-align: center;
  color: #fff;
  padding: 48px;
  background: rgba(8, 12, 30, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.15);
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.08), inset 0 0 40px rgba(0, 240, 255, 0.03);
}

.overlay-content h2 {
  font-size: 42px;
  color: #44ddff;
  margin: 0 0 16px;
  letter-spacing: 8px;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.3);
}

.overlay-content p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 20px;
  letter-spacing: 2px;
}

.btn-resume {
  padding: 12px 48px;
  font-size: 14px;
  font-weight: bold;
  color: #00f0ff;
  background: transparent;
  border: 1px solid rgba(0, 240, 255, 0.5);
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 6px;
  text-transform: uppercase;
  transition: all 0.3s ease;
}

.btn-resume:hover {
  background: rgba(0, 240, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4), inset 0 0 20px rgba(0, 240, 255, 0.1);
  border-color: rgba(0, 240, 255, 0.8);
  color: #fff;
}

.hint {
  margin-top: 16px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 3px;
}
</style>
