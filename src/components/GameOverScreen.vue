<template>
  <div class="overlay gameover-overlay">
    <!-- Animated background decorations -->
    <div class="bg-grid"></div>
    <div class="bg-scanline"></div>

    <div class="gameover-content">
      <div class="content-glow-top"></div>

      <h2 class="gameover-title" :class="{ victory: victory }">
        {{ victory ? 'Victory!' : 'Castle Fallen' }}
      </h2>

      <div class="final-score">
        <span class="final-label">Final Score</span>
        <span class="final-value" :class="{ victory: victory }">{{ score.toLocaleString() }}</span>
      </div>

      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">Waves Cleared</span>
          <span class="stat-value" :class="{ victory: victory }">{{ wave + 1 }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Waves</span>
          <span class="stat-value" :class="{ victory: victory }">20</span>
        </div>
      </div>

      <button class="btn-restart" :class="{ victory: victory }" @click="$emit('restart')">
        <span class="btn-text">Play Again</span>
        <span class="btn-glow"></span>
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
/* === Overlay === */
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

.gameover-overlay {
  background: radial-gradient(ellipse at center, rgba(5, 10, 30, 0.92) 0%, rgba(2, 5, 15, 0.97) 100%);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

/* Subtle grid background */
.bg-grid {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 240, 255, 0.025) 2px, transparent 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0, 240, 255, 0.025) 2px, transparent 4px);
  background-size: 40px 40px;
  pointer-events: none;
}

/* Animated scan line for cyberpunk feel */
.bg-scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.5), rgba(0, 240, 255, 0.7), rgba(0, 240, 255, 0.5), transparent);
  box-shadow: 0 0 20px 4px rgba(0, 240, 255, 0.25);
  animation: scanline 4s linear infinite;
  pointer-events: none;
}

@keyframes scanline {
  0% { top: -2px; }
  100% { top: 100%; }
}

/* === Content Card === */
.gameover-content {
  position: relative;
  text-align: center;
  color: #fff;
  max-width: 480px;
  width: 90%;
  padding: 48px 40px;
  background: rgba(10, 15, 30, 0.8);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 16px;
  box-shadow:
    0 0 60px rgba(0, 240, 255, 0.06),
    inset 0 0 60px rgba(0, 240, 255, 0.02);
}

/* Top accent glow line on card */
.content-glow-top {
  position: absolute;
  top: -1px;
  left: 15%;
  right: 15%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.6), transparent);
  pointer-events: none;
}

/* === Title === */
.gameover-title {
  font-size: 48px;
  font-weight: 900;
  margin: 0 0 28px;
  letter-spacing: 6px;
  color: #ff4466;
  text-shadow:
    0 0 10px rgba(255, 68, 102, 0.6),
    0 0 30px rgba(255, 68, 102, 0.4),
    0 0 60px rgba(255, 68, 102, 0.2);
  animation: title-pulse 2s ease-in-out infinite;
}

.gameover-title.victory {
  color: #00f0ff;
  text-shadow:
    0 0 10px rgba(0, 240, 255, 0.6),
    0 0 30px rgba(0, 240, 255, 0.4),
    0 0 60px rgba(0, 240, 255, 0.2);
}

@keyframes title-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}

/* === Final Score === */
.final-score {
  margin-bottom: 28px;
}

.final-label {
  display: block;
  font-size: 12px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 10px;
}

.final-value {
  font-size: 56px;
  font-weight: 900;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #ff4466 0%, #ff6644 30%, #ffaa55 50%, #ff6644 70%, #ff4466 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
  filter: drop-shadow(0 0 18px rgba(255, 68, 102, 0.5));
}

.final-value.victory {
  background: linear-gradient(135deg, #00f0ff 0%, #88eeff 30%, #ffd700 50%, #88eeff 70%, #00f0ff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 18px rgba(0, 240, 255, 0.5));
}

@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

/* === Stats === */
.stats {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 36px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 28px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(0, 240, 255, 0.12);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(0, 240, 255, 0.06);
  border-color: rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.1);
}

.stat-label {
  display: block;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #ffaa33;
  letter-spacing: 1px;
}

.stat-value.victory {
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

/* === Restart Button (bordered style) === */
.btn-restart {
  position: relative;
  padding: 16px 64px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: transparent;
  border: 1px solid rgba(255, 68, 102, 0.5);
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 6px;
  text-transform: uppercase;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-restart .btn-text {
  position: relative;
  z-index: 1;
}

.btn-restart .btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 68, 102, 0.12), rgba(255, 68, 102, 0.04));
  transition: all 0.3s ease;
}

.btn-restart:hover {
  border-color: rgba(255, 68, 102, 0.8);
  box-shadow: 0 0 30px rgba(255, 68, 102, 0.2), inset 0 0 30px rgba(255, 68, 102, 0.05);
  transform: translateY(-1px);
}

.btn-restart:hover .btn-glow {
  background: linear-gradient(135deg, rgba(255, 68, 102, 0.25), rgba(255, 68, 102, 0.08));
}

.btn-restart:active {
  transform: scale(0.97);
  border-color: rgba(255, 68, 102, 1);
  box-shadow: 0 0 50px rgba(255, 68, 102, 0.4), inset 0 0 40px rgba(255, 68, 102, 0.1);
  transition: all 0.1s ease;
}

/* Victory variant uses cyan/gold accent */
.btn-restart.victory {
  border-color: rgba(0, 240, 255, 0.5);
}

.btn-restart.victory .btn-glow {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.12), rgba(168, 85, 247, 0.06));
}

.btn-restart.victory:hover {
  border-color: rgba(0, 240, 255, 0.8);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.2), inset 0 0 30px rgba(0, 240, 255, 0.05);
}

.btn-restart.victory:hover .btn-glow {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(168, 85, 247, 0.1));
}

.btn-restart.victory:active {
  border-color: rgba(0, 240, 255, 1);
  box-shadow: 0 0 50px rgba(0, 240, 255, 0.4), inset 0 0 40px rgba(0, 240, 255, 0.1);
}
</style>
