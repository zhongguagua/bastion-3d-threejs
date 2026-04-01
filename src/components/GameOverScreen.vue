<template>
  <div class="overlay gameover-overlay">
    <div class="gameover-content">
      <h2 class="gameover-title" :class="{ victory: victory }">
        {{ victory ? '胜利!' : '城堡沦陷' }}
      </h2>
      <div class="final-score">
        <span class="final-label">最终得分</span>
        <span class="final-value">{{ score.toLocaleString() }}</span>
      </div>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">通过波次</span>
          <span class="stat-value">{{ wave + 1 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总波次</span>
          <span class="stat-value">20</span>
        </div>
      </div>
      <button class="btn-restart" @click="$emit('restart')">
        再来一局
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameOverScreen',
  props: {
    score: { type: Number, default: 0 },
    wave: { type: Number, default: 0 },
    victory: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
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
  pointer-events: auto;
}

.overlay > * {
  pointer-events: auto;
}

.gameover-overlay {
  background: rgba(0, 0, 20, 0.85);
  backdrop-filter: blur(8px);
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

.gameover-title.victory {
  color: #44ddff;
  text-shadow: 0 0 20px rgba(68, 221, 255, 0.5), 0 0 40px rgba(68, 221, 255, 0.3);
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
  text-shadow: 0 0 20px rgba(68, 221, 255, 0.5), 0 0 40px rgba(68, 221, 255, 0.3);
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
