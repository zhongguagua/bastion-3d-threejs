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
      <button class="btn-next-wave" v-if="wave.phase === 'waiting' || wave.phase === 'complete'" @click="$emit('startWave')">
        下一波 &rarr;
      </button>
    </div>
    <button class="btn-pause" @click="$emit('pause')">
      || 暂停
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
  padding: 12px 20px;
  z-index: 10;
  pointer-events: none;
  box-sizing: border-box;
}

.hud-top {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.hud-icon {
  font-size: 16px;
}

.gold .hud-icon { color: #ffaa33; }
.lives .hud-icon { color: #ff4466; }

.hud-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hud-value {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
  min-width: 30px;
  text-align: right;
}

.gold .hud-value { color: #ffaa33; }
.lives .hud-value { color: #ff4466; }
.score-val { color: #44ddff; }

.btn-next-wave {
  padding: 6px 18px;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #44aa44, #33cc33);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  pointer-events: auto;
  letter-spacing: 1px;
  transition: all 0.2s;
}

.btn-next-wave:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 12px rgba(50, 200, 50, 0.4);
}

.btn-pause {
  position: absolute;
  top: 12px;
  right: 20px;
  padding: 6px 14px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s;
}

.btn-pause:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}
</style>
