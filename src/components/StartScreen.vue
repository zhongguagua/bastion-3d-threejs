<template>
  <div class="start-overlay">
    <div class="start-content">
      <!-- Animated background decoration -->
      <div class="bg-grid"></div>
      <div class="bg-scanline"></div>

      <div class="title-group">
        <div class="title-badge">TOWER DEFENSE</div>
        <h1 class="game-title">
          <span class="title-line">城堡守卫战</span>
        </h1>
        <p class="game-subtitle">CASTLE DEFENSE</p>
      </div>

      <div class="game-desc">
        <p>建造防御塔，抵御敌人入侵！</p>
        <p>合理布局，升级塔防，守护你的城堡</p>
      </div>

      <div class="tower-preview">
        <div class="preview-item" v-for="tower in towers" :key="tower.name">
          <div class="preview-icon-wrap">
            <span class="preview-icon">{{ tower.icon }}</span>
          </div>
          <span class="preview-name">{{ tower.name }}</span>
          <span class="preview-desc">{{ tower.desc }}</span>
        </div>
      </div>

      <div class="controls-info">
        <div class="control-row">
          <span class="key"><span class="key-inner">LMB</span></span>
          <span class="label">选择/放置塔</span>
        </div>
        <div class="control-row">
          <span class="key"><span class="key-inner">RMB</span></span>
          <span class="label">取消放置</span>
        </div>
        <div class="control-row">
          <span class="key"><span class="key-inner">ESC</span></span>
          <span class="label">暂停游戏</span>
        </div>
      </div>

      <button ref="startBtn" class="btn-start" :class="{ clicked: btnClicked }" @click="handleStart">
        <span class="btn-text">开始游戏</span>
        <span class="btn-glow"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StartScreen',
  data() {
    return {
      btnClicked: false,
      towers: [
        { icon: '🏹', name: '箭塔', desc: '快速攻击' },
        { icon: '💣', name: '炮塔', desc: '范围伤害' },
        { icon: '❄', name: '冰塔', desc: '减速敌人' },
        { icon: '⚡', name: '电塔', desc: '链式攻击' },
        { icon: '🎯', name: '狙击塔', desc: '远程高伤' },
      ],
    }
  },
  beforeDestroy() {
  },
  methods: {
    handleStart() {
      this.btnClicked = true
      setTimeout(() => {
        this.btnClicked = false
      }, 300)
      this.$emit('start')
    },
  },
}
</script>

<style scoped>
/* === Overlay === */
.start-overlay {
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
  background: radial-gradient(ellipse at center, rgba(5, 10, 30, 0.9) 0%, rgba(2, 5, 15, 0.97) 100%);
  overflow: hidden;
}

.start-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(68, 221, 255, 0.03) 2px, transparent 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(68, 221, 255, 0.03) 2px, transparent 4px);
  background-size: 40px 40px;
  pointer-events: none;
}

/* Animated scan line */
.bg-scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(68, 221, 255, 0.6), rgba(68, 221, 255, 0.8), rgba(68, 221, 255, 0.6), transparent);
  box-shadow: 0 0 20px 4px rgba(68, 221, 255, 0.3);
  animation: scanline 4s linear infinite;
  pointer-events: none;
}

@keyframes scanline {
  0% { top: -2px; }
  100% { top: 100%; }
}

/* === Content === */
.start-content {
  position: relative;
  text-align: center;
  color: #fff;
  max-width: 600px;
  padding: 48px 40px;
  background: rgba(8, 12, 30, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(68, 221, 255, 0.15);
  border-radius: 16px;
  box-shadow:
    0 0 40px rgba(68, 221, 255, 0.08),
    inset 0 0 60px rgba(68, 221, 255, 0.03);
}

.start-content::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(68, 221, 255, 0.6), transparent);
}

/* === Title === */
.title-group {
  margin-bottom: 24px;
}

.title-badge {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 4px;
  color: rgba(68, 221, 255, 0.8);
  border: 1px solid rgba(68, 221, 255, 0.3);
  border-radius: 3px;
  padding: 2px 10px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.game-title {
  font-size: 52px;
  font-weight: 900;
  margin: 0 0 8px;
  letter-spacing: 8px;
  line-height: 1.1;
}

.title-line {
  background: linear-gradient(135deg, #44ddff 0%, #88eeff 40%, #ffffff 50%, #88eeff 60%, #44ddff 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
  filter: drop-shadow(0 0 20px rgba(68, 221, 255, 0.5));
}

@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}

.game-subtitle {
  font-size: 13px;
  letter-spacing: 16px;
  color: rgba(255, 255, 255, 0.3);
  margin: 0;
  font-weight: 300;
}

/* === Description === */
.game-desc {
  margin-bottom: 28px;
  line-height: 2;
  color: rgba(255, 255, 255, 0.55);
  font-size: 13px;
  letter-spacing: 0.5px;
}

/* === Tower Preview === */
.tower-preview {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 14px 10px;
  background: rgba(68, 221, 255, 0.04);
  border: 1px solid rgba(68, 221, 255, 0.1);
  border-radius: 10px;
  min-width: 76px;
  transition: all 0.3s ease;
}

.preview-item:hover {
  background: rgba(68, 221, 255, 0.1);
  border-color: rgba(68, 221, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(68, 221, 255, 0.15);
}

.preview-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(68, 221, 255, 0.08);
  border: 1px solid rgba(68, 221, 255, 0.15);
}

.preview-icon {
  font-size: 20px;
}

.preview-name {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 1px;
}

.preview-desc {
  font-size: 10px;
  color: rgba(68, 221, 255, 0.7);
}

/* === Controls === */
.controls-info {
  margin-bottom: 32px;
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  min-width: 64px;
  height: 28px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
}

.key-inner {
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
  font-family: monospace;
}

.label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.5px;
}

/* === Button === */
.btn-start {
  position: relative;
  padding: 16px 72px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  background: transparent;
  border: 1px solid rgba(68, 221, 255, 0.5);
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 6px;
  text-transform: uppercase;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-start .btn-text {
  position: relative;
  z-index: 1;
}

.btn-start .btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(68, 221, 255, 0.15), rgba(68, 221, 255, 0.05));
  transition: all 0.3s ease;
}

.btn-start:hover {
  border-color: rgba(68, 221, 255, 0.8);
  box-shadow: 0 0 30px rgba(68, 221, 255, 0.2), inset 0 0 30px rgba(68, 221, 255, 0.05);
  transform: translateY(-1px);
}

.btn-start:hover .btn-glow {
  background: linear-gradient(135deg, rgba(68, 221, 255, 0.3), rgba(68, 221, 255, 0.1));
}

.btn-start:active,
.btn-start.clicked {
  transform: scale(0.97);
  border-color: rgba(68, 221, 255, 1);
  box-shadow: 0 0 50px rgba(68, 221, 255, 0.4), inset 0 0 40px rgba(68, 221, 255, 0.1);
  transition: all 0.1s ease;
}
</style>
