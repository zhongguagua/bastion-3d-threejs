<template>
  <div class="space-game" @click.self="focusContainer">
    <!-- Three.js 画布容器 -->
    <div ref="gameContainer" class="game-container"></div>

    <!-- ====== 开始界面 ====== -->
    <div v-if="gameState === 'ready'" class="overlay start-overlay">
      <div class="start-content">
        <h1 class="game-title">
          <span class="title-icon">&#9733;</span>
          太空穿越
          <span class="title-icon">&#9733;</span>
        </h1>
        <p class="game-subtitle">SPACE RUNNER</p>
        <div class="game-desc">
          <p>驾驶飞船穿越小行星带，收集能量球获取分数</p>
          <p>小心躲避障碍物，坚持越久分数越高！</p>
        </div>
        <div class="controls-info">
          <div class="control-row">
            <div class="key-group">
              <span class="key">W</span>
              <span class="key">A</span>
              <span class="key">S</span>
              <span class="key">D</span>
            </div>
            <span class="control-label">/ 方向键 移动飞船</span>
          </div>
          <div class="control-row">
            <span class="key key-wide">SPACE</span>
            <span class="control-label">开始 / 暂停</span>
          </div>
        </div>
        <div class="legend">
          <div class="legend-item">
            <span class="legend-dot green"></span>
            <span>能量球 - 加分 + 回血</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot gold"></span>
            <span>护盾球 - 护盾 + 高分</span>
          </div>
        </div>
        <button class="btn-start" @click="startGame">
          开始游戏
        </button>
        <p class="hint">或按 空格键 开始</p>
      </div>
    </div>

    <!-- ====== 游戏 HUD ====== -->
    <div v-if="gameState === 'playing' || gameState === 'paused'" class="hud">
      <!-- 顶部信息栏 -->
      <div class="hud-top">
        <div class="hud-score">
          <span class="hud-label">得分</span>
          <span class="hud-value score-value">{{ displayScore }}</span>
        </div>
        <div class="hud-speed">
          <span class="hud-label">速度</span>
          <div class="speed-bar-container">
            <div class="speed-bar" :style="{ width: speedPercent + '%' }"></div>
          </div>
          <span class="hud-value speed-value">{{ displaySpeed }}x</span>
        </div>
        <div class="hud-shield" :class="{ 'shield-active': hasShield }">
          <span class="shield-icon">{{ hasShield ? '&#9737;' : '&#9738;' }}</span>
          <span class="hud-label">{{ hasShield ? '护盾中' : '无护盾' }}</span>
        </div>
      </div>

      <!-- 生命值条 -->
      <div class="hp-bar-container">
        <div
          class="hp-bar"
          :style="{
            width: hpPercent + '%',
            backgroundColor: hpColor
          }"
        ></div>
        <span class="hp-text">{{ hp }} / 100</span>
      </div>

      <!-- 暂停按钮 -->
      <button class="btn-pause" @click="togglePause">
        {{ gameState === 'paused' ? '继续' : '暂停' }}
      </button>
    </div>

    <!-- ====== 暂停界面 ====== -->
    <div v-if="gameState === 'paused'" class="overlay pause-overlay">
      <div class="pause-content">
        <h2 class="pause-title">游戏暂停</h2>
        <p class="pause-score">当前得分：{{ displayScore }}</p>
        <button class="btn-resume" @click="togglePause">继续游戏</button>
        <p class="hint">按 空格键 继续</p>
      </div>
    </div>

    <!-- ====== 结束界面 ====== -->
    <div v-if="gameState === 'gameover'" class="overlay gameover-overlay">
      <div class="gameover-content">
        <h2 class="gameover-title">游戏结束</h2>
        <div class="final-score">
          <span class="final-label">最终得分</span>
          <span class="final-value">{{ displayScore }}</span>
        </div>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">存活时间</span>
            <span class="stat-value">{{ survivalTime }}s</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最高速度</span>
            <span class="stat-value">{{ maxSpeed }}x</span>
          </div>
        </div>
        <button class="btn-restart" @click="startGame">再来一局</button>
        <p class="hint">按 空格键 重新开始</p>
      </div>
    </div>
  </div>
</template>

<script>
import SpaceRunnerGame, { GAME_STATE } from '../game/SpaceRunnerGame'

export default {
  name: 'SpaceGame',
  data() {
    return {
      gameState: GAME_STATE.READY,
      score: 0,
      hp: 100,
      hasShield: false,
      shieldTimer: 0,
      game: null,
    }
  },
  computed: {
    displayScore() {
      return this.score.toLocaleString()
    },
    hpPercent() {
      return Math.max(0, this.hp)
    },
    hpColor() {
      if (this.hp > 60) return '#44ff88'
      if (this.hp > 30) return '#ffaa33'
      return '#ff4444'
    },
    displaySpeed() {
      if (!this.game) return '1.0'
      return (this.game.speed / 15).toFixed(1)
    },
    speedPercent() {
      if (!this.game) return 10
      return Math.min(100, ((this.game.speed - 15) / 30) * 100)
    },
    survivalTime() {
      if (!this.game) return '0'
      return this.game.elapsedTime ? this.game.elapsedTime.toFixed(1) : '0'
    },
    maxSpeed() {
      if (!this.game) return '1.0'
      return (this.game.speed / 15).toFixed(1)
    },
  },
  mounted() {
    this.initGame()
  },
  beforeDestroy() {
    if (this.game) {
      this.game.destroy()
    }
  },
  methods: {
    initGame() {
      this.game = new SpaceRunnerGame(this.$refs.gameContainer)

      // 绑定回调
      this.game.onStateChange = (state) => {
        this.gameState = state
      }
      this.game.onScoreChange = (score) => {
        this.score = score
      }
      this.game.onHpChange = (hp) => {
        this.hp = hp
      }
      this.game.onShieldChange = (shield, timer) => {
        this.hasShield = shield
        this.shieldTimer = timer
      }

      // 初始渲染一帧（展示场景）
      this.game.renderer.render(this.game.scene, this.game.camera)
    },

    startGame() {
      if (this.game) {
        this.game.start()
      }
    },

    togglePause() {
      if (!this.game) return
      if (this.game.state === GAME_STATE.PLAYING) {
        this.game.pause()
      } else if (this.game.state === GAME_STATE.PAUSED) {
        this.game.resume()
      }
    },

    focusContainer() {
      this.$el.focus()
    },
  },
}
</script>

<style scoped>
.space-game {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  outline: none;
}

.game-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* ====== 通用覆盖层 ====== */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  pointer-events: none;
}

.overlay > * {
  pointer-events: auto;
}

/* ====== 开始界面 ====== */
.start-overlay {
  background: rgba(0, 0, 20, 0.7);
  backdrop-filter: blur(4px);
}

.start-content {
  text-align: center;
  color: #fff;
  max-width: 500px;
  padding: 40px;
}

.game-title {
  font-size: 48px;
  font-weight: 900;
  color: #44ddff;
  text-shadow:
    0 0 20px rgba(68, 221, 255, 0.5),
    0 0 40px rgba(68, 221, 255, 0.3);
  margin: 0 0 8px;
  letter-spacing: 8px;
}

.title-icon {
  color: #ffaa33;
  font-size: 32px;
}

.game-subtitle {
  font-size: 16px;
  letter-spacing: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 30px;
}

.game-desc {
  margin-bottom: 30px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.75);
  font-size: 14px;
}

.controls-info {
  margin-bottom: 25px;
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 10px;
}

.key-group {
  display: flex;
  gap: 4px;
}

.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  color: #44ddff;
}

.key-wide {
  min-width: 80px;
}

.control-label {
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 30px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.green {
  background: #00ffaa;
  box-shadow: 0 0 6px #00ffaa;
}

.legend-dot.gold {
  background: #ffaa00;
  box-shadow: 0 0 6px #ffaa00;
}

.btn-start {
  padding: 14px 60px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #2288ff, #00ccff);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 4px;
  box-shadow: 0 4px 20px rgba(0, 150, 255, 0.4);
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(0, 150, 255, 0.6);
}

.hint {
  margin-top: 15px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
}

/* ====== HUD ====== */
.hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 16px 24px;
  z-index: 5;
  pointer-events: none;
  box-sizing: border-box;
}

.hud-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.hud-score,
.hud-speed {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hud-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hud-value {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
}

.score-value {
  color: #44ddff;
  min-width: 80px;
  text-shadow: 0 0 10px rgba(68, 221, 255, 0.5);
}

.speed-value {
  color: #ffaa33;
  font-size: 16px;
}

.speed-bar-container {
  width: 80px;
  height: 6px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  overflow: hidden;
}

.speed-bar {
  height: 100%;
  background: linear-gradient(90deg, #44ddff, #ffaa33);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.hud-shield {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.hud-shield.shield-active {
  background: rgba(255, 170, 0, 0.2);
  box-shadow: 0 0 10px rgba(255, 170, 0, 0.3);
}

.shield-icon {
  font-size: 18px;
}

.shield-active .shield-icon {
  color: #ffaa00;
}

.hp-bar-container {
  position: relative;
  width: 200px;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.hp-bar {
  height: 100%;
  border-radius: 5px;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.hp-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 9px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.btn-pause {
  position: absolute;
  top: 16px;
  right: 24px;
  padding: 6px 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s ease;
}

.btn-pause:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* ====== 暂停界面 ====== */
.pause-overlay {
  background: rgba(0, 0, 20, 0.5);
  backdrop-filter: blur(3px);
}

.pause-content {
  text-align: center;
  color: #fff;
}

.pause-title {
  font-size: 36px;
  margin: 0 0 16px;
  color: #44ddff;
}

.pause-score {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 24px;
}

.btn-resume {
  padding: 12px 48px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #2288ff, #00ccff);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 2px;
}

.btn-resume:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 150, 255, 0.5);
}

/* ====== 结束界面 ====== */
.gameover-overlay {
  background: rgba(0, 0, 20, 0.8);
  backdrop-filter: blur(6px);
}

.gameover-content {
  text-align: center;
  color: #fff;
}

.gameover-title {
  font-size: 42px;
  margin: 0 0 24px;
  color: #ff4466;
  text-shadow: 0 0 20px rgba(255, 68, 102, 0.5);
}

.final-score {
  margin-bottom: 24px;
}

.final-label {
  display: block;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
}

.final-value {
  font-size: 56px;
  font-weight: 900;
  color: #44ddff;
  text-shadow:
    0 0 20px rgba(68, 221, 255, 0.5),
    0 0 40px rgba(68, 221, 255, 0.3);
}

.stats {
  display: flex;
  gap: 32px;
  justify-content: center;
  margin-bottom: 30px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 22px;
  font-weight: bold;
  color: #ffaa33;
}

.btn-restart {
  padding: 14px 48px;
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #ff4466, #ff6644);
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 2px;
  box-shadow: 0 4px 20px rgba(255, 68, 102, 0.4);
}

.btn-restart:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 30px rgba(255, 68, 102, 0.6);
}
</style>
