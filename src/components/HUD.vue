<template>
  <div class="hud">
    <div class="hud-top">
      <div class="hud-item gold">
        <span class="hud-icon">&#9733;</span>
        <span class="hud-label">金币</span>
        <span class="hud-value">{{ gold }}</span>
      </div>
      <div class="hud-item lives">
        <span class="hud-icon">&#9829;</span>
        <span class="hud-label">生命</span>
        <span class="hud-value">{{ lives }}</span>
      </div>
      <div class="hud-item wave">
        <span class="hud-label">波次</span>
        <span class="hud-value">{{ wave.current + 1 }} / {{ wave.total }}</span>
      </div>
      <div class="hud-item score-display">
        <span class="hud-label">分数</span>
        <span class="hud-value score-val">{{ score.toLocaleString() }}</span>
      </div>
      <div class="hud-item enemies">
        <span class="hud-label">剩余敌人</span>
        <span class="hud-value">{{ wave.enemiesRemaining }}</span>
      </div>
      <button
        class="btn-next-wave"
        v-if="wave.phase === 'waiting' || wave.phase === 'complete'"
        @click="$emit('startWave')"
      >
        下一波 &rarr;
      </button>
    </div>
    <button class="btn-pause" @click="$emit('pause')">
      <span class="pause-icon">❚❚</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'HUD',
  props: {
    gold: { type: Number, default: 0 },
    lives: { type: Number, default: 20 },
    score: { type: Number, default: 0 },
    wave: { type: Object, default: () => ({ current: 0, total: 20, enemiesRemaining: 0, phase: 'waiting' }) },
  },
}
</script>

<style scoped>
.hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 16px 24px;
  z-index: 10;
  pointer-events: none;
  box-sizing: border-box;
}

.hud::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.4), rgba(168, 85, 247, 0.6), rgba(0, 240, 255, 0.4), transparent);
  pointer-events: none;
}

.hud-top {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: rgba(10, 15, 30, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 240, 255, 0.15);
  border-radius: 16px;
  margin: 0 8px;
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  border-radius: 24px;
  background: rgba(0, 240, 255, 0.04);
  border: 1px solid rgba(0, 240, 255, 0.08);
  transition: background 0.3s ease;
}

.hud-item:hover {
  background: rgba(0, 240, 255, 0.08);
}

.hud-icon {
  font-size: 14px;
  opacity: 0.9;
}

.hud-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
  font-family: 'Segoe UI', 'SF Pro Display', -apple-system, sans-serif;
}

.hud-value {
  font-size: 17px;
  font-weight: 700;
  color: #00f0ff;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
  text-shadow: 0 0 12px rgba(0, 240, 255, 0.35);
  font-family: 'Segoe UI', 'SF Pro Display', -apple-system, sans-serif;
}

/* Gold */
.gold .hud-icon {
  color: #ffc544;
  text-shadow: 0 0 8px rgba(255, 197, 68, 0.5);
}

.gold .hud-value {
  color: #ffc544;
  text-shadow: 0 0 14px rgba(255, 197, 68, 0.4);
}

/* Lives */
.lives .hud-icon {
  color: #ff4466;
  text-shadow: 0 0 8px rgba(255, 68, 102, 0.5);
}

.lives .hud-value {
  color: #ff4466;
  text-shadow: 0 0 14px rgba(255, 68, 102, 0.4);
}

/* Score */
.score-val {
  color: #a855f7;
  text-shadow: 0 0 14px rgba(168, 85, 247, 0.4);
}

/* Enemies */
.enemies .hud-value {
  color: #00f0ff;
  text-shadow: 0 0 14px rgba(0, 240, 255, 0.4);
}

/* Next Wave Button */
.btn-next-wave {
  padding: 8px 24px;
  font-size: 11px;
  font-weight: 700;
  color: #00f0ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: rgba(0, 240, 255, 0.08);
  border: 1px solid rgba(0, 240, 255, 0.3);
  border-radius: 24px;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.3);
  font-family: 'Segoe UI', 'SF Pro Display', -apple-system, sans-serif;
  animation: btnPulse 2.5s ease-in-out infinite;
  white-space: nowrap;
}

.btn-next-wave:hover {
  background: rgba(0, 240, 255, 0.18);
  border-color: rgba(0, 240, 255, 0.6);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.25), inset 0 0 20px rgba(0, 240, 255, 0.05);
  color: #fff;
  text-shadow: 0 0 12px rgba(0, 240, 255, 0.5);
}

.btn-next-wave:active {
  transform: scale(0.97);
}

@keyframes btnPulse {
  0%, 100% {
    box-shadow: 0 0 6px rgba(0, 240, 255, 0.1);
    border-color: rgba(0, 240, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 18px rgba(0, 240, 255, 0.2);
    border-color: rgba(0, 240, 255, 0.5);
  }
}

/* Pause Button */
.btn-pause {
  position: absolute;
  top: 16px;
  right: 32px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  background: rgba(10, 15, 30, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s ease;
}

.btn-pause:hover {
  background: rgba(10, 15, 30, 0.8);
  color: #00f0ff;
  border-color: rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.15);
}

.btn-pause:active {
  transform: scale(0.95);
}

.pause-icon {
  font-size: 12px;
  letter-spacing: 2px;
  line-height: 1;
}
</style>
