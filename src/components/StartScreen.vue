<template>
  <div class="start-overlay">
    <div class="start-content">
      <h1 class="game-title">城堡守卫战</h1>
      <p class="game-subtitle">CASTLE DEFENSE</p>
      <div class="game-desc">
        <p>建造防御塔，抵御敌人入侵！</p>
        <p>合理布局，升级塔防，守护你的城堡</p>
      </div>

      <div class="tower-preview">
        <div class="preview-item" v-for="tower in towers" :key="tower.name">
          <span class="preview-icon">{{ tower.icon }}</span>
          <span class="preview-name">{{ tower.name }}</span>
          <span class="preview-desc">{{ tower.desc }}</span>
        </div>
      </div>

      <div class="controls-info">
        <div class="control-row">
          <span class="key">鼠标左键</span>
          <span class="label">选择/放置塔</span>
        </div>
        <div class="control-row">
          <span class="key">鼠标右键</span>
          <span class="label">取消放置</span>
        </div>
        <div class="control-row">
          <span class="key">ESC</span>
          <span class="label">暂停游戏</span>
        </div>
      </div>

      <button ref="startBtn" class="btn-start" :class="{ clicked: btnClicked }" @click="handleStart">
        开始游戏
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
  background: rgba(10, 15, 25, 0.85);
  backdrop-filter: blur(8px);
}

.start-content {
  text-align: center;
  color: #fff;
  max-width: 560px;
  padding: 40px;
}

.game-title {
  font-size: 48px;
  font-weight: 900;
  color: #44ddff;
  text-shadow: 0 0 20px rgba(68, 221, 255, 0.5), 0 0 40px rgba(68, 221, 255, 0.3);
  margin: 0 0 8px;
  letter-spacing: 6px;
}

.game-subtitle {
  font-size: 16px;
  letter-spacing: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 30px;
}

.game-desc {
  margin-bottom: 28px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.tower-preview {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.preview-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  min-width: 70px;
}

.preview-icon {
  font-size: 24px;
}

.preview-name {
  font-size: 12px;
  font-weight: bold;
  color: #fff;
}

.preview-desc {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
}

.controls-info {
  margin-bottom: 28px;
}

.control-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
}

.key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  color: #44ddff;
  min-width: 80px;
}

.label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
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

.btn-start.clicked {
  transform: scale(0.9);
  background: linear-gradient(135deg, #00ccff, #2288ff);
  box-shadow: 0 0 40px rgba(0, 200, 255, 0.8);
  transition: all 0.1s ease;
}
</style>
