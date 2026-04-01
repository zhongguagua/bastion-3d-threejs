<template>
  <div class="tower-panel">
    <!-- Tower Selection Bar -->
    <div class="tower-bar" v-if="!selectedTower">
      <div class="tower-card" v-for="tower in towerTypes" :key="tower.type"
        :class="{ disabled: gold < tower.cost }"
        @click="gold >= tower.cost && $emit('select-type', tower.type)">
        <div class="tower-icon" :style="{ backgroundColor: tower.iconColor }">
          <span>{{ tower.icon }}</span>
        </div>
        <div class="tower-info">
          <div class="tower-name">{{ tower.name }}</div>
          <div class="tower-cost">&#9733; {{ tower.cost }}</div>
        </div>
      </div>
    </div>

    <!-- Selected Tower Info -->
    <div class="selected-info" v-if="selectedTower">
      <div class="sel-header">
        <span class="sel-name">{{ getTowerName(selectedTower) }} Lv.{{ selectedTower.level + 1 }}</span>
        <button class="btn-close-sel" @click="$emit('select-type', null)">&times;</button>
      </div>
      <div class="sel-stats">
        <div class="stat-row">
          <span class="stat-label">伤害</span>
          <div class="stat-bar-wrap">
            <div class="stat-bar stat-bar-damage" :style="{ width: getDamagePercent() + '%' }"></div>
          </div>
          <span class="stat-value">{{ getCurrentStat('damage') }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">射程</span>
          <div class="stat-bar-wrap">
            <div class="stat-bar stat-bar-range" :style="{ width: getRangePercent() + '%' }"></div>
          </div>
          <span class="stat-value">{{ getCurrentStat('range').toFixed(1) }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-label">攻速</span>
          <div class="stat-bar-wrap">
            <div class="stat-bar stat-bar-speed" :style="{ width: getFireRatePercent() + '%' }"></div>
          </div>
          <span class="stat-value">{{ getCurrentStat('fireRate').toFixed(2) }}s</span>
        </div>
      </div>
      <div class="sel-actions">
        <button class="btn-upgrade"
          v-if="selectedTower.level < 2"
          :class="{ disabled: gold < getUpgradeCost() }"
          @click="gold >= getUpgradeCost() && $emit('upgrade')">
          升级 (&#9733;{{ getUpgradeCost() }})
        </button>
        <button class="btn-sell" @click="$emit('sell')">
          出售 (&#9733;{{ getSellValue() }})
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { TOWER, TOWER_STATS } from '../game/core/Constants'

export default {
  name: 'TowerPanel',
  props: {
    gold: { type: Number, default: 0 },
    selectedTower: { type: Object, default: null },
  },
  computed: {
    towerTypes() {
      return [
        { type: TOWER.TYPES.ARROW, ...TOWER_STATS[TOWER.TYPES.ARROW], icon: '🏹', iconColor: '#44aa44', cost: TOWER_STATS[TOWER.TYPES.ARROW].cost[0] },
        { type: TOWER.TYPES.CANNON, ...TOWER_STATS[TOWER.TYPES.CANNON], icon: '💣', iconColor: '#cc6633', cost: TOWER_STATS[TOWER.TYPES.CANNON].cost[0] },
        { type: TOWER.TYPES.ICE, ...TOWER_STATS[TOWER.TYPES.ICE], icon: '❄', iconColor: '#4488cc', cost: TOWER_STATS[TOWER.TYPES.ICE].cost[0] },
        { type: TOWER.TYPES.LIGHTNING, ...TOWER_STATS[TOWER.TYPES.LIGHTNING], icon: '⚡', iconColor: '#aaaa44', cost: TOWER_STATS[TOWER.TYPES.LIGHTNING].cost[0] },
        { type: TOWER.TYPES.SNIPER, ...TOWER_STATS[TOWER.TYPES.SNIPER], icon: '🎯', iconColor: '#884488', cost: TOWER_STATS[TOWER.TYPES.SNIPER].cost[0] },
      ]
    },
  },
  methods: {
    getTowerName(tower) {
      return TOWER_STATS[tower.type].name
    },
    getCurrentStat(stat) {
      if (!this.selectedTower) return 0
      const stats = TOWER_STATS[this.selectedTower.type]
      return stats[stat] ? stats[stat][this.selectedTower.level] : 0
    },
    getDamagePercent() {
      if (!this.selectedTower) return 0
      const stats = TOWER_STATS[this.selectedTower.type]
      const values = stats.damage
      const max = Math.max(...values)
      const current = values[this.selectedTower.level] || 0
      return (current / max) * 100
    },
    getRangePercent() {
      if (!this.selectedTower) return 0
      const stats = TOWER_STATS[this.selectedTower.type]
      const values = stats.range
      const max = Math.max(...values)
      const current = values[this.selectedTower.level] || 0
      return (current / max) * 100
    },
    getFireRatePercent() {
      if (!this.selectedTower) return 0
      const stats = TOWER_STATS[this.selectedTower.type]
      const values = stats.fireRate
      const min = Math.min(...values)
      const current = values[this.selectedTower.level] || 0
      return (min / current) * 100
    },
    getUpgradeCost() {
      if (!this.selectedTower || this.selectedTower.level >= 2) return 0
      const stats = TOWER_STATS[this.selectedTower.type]
      return stats.cost[this.selectedTower.level + 1] || 0
    },
    getSellValue() {
      if (!this.selectedTower) return 0
      const stats = TOWER_STATS[this.selectedTower.type]
      let total = 0
      for (let i = 0; i <= this.selectedTower.level; i++) {
        total += stats.cost[i]
      }
      return Math.floor(total * 0.6)
    },
  },
}
</script>

<style scoped>
/* ============================================
   Cyberpunk Glass-Morphism Tower Panel
   ============================================ */

.tower-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 16px 24px;
  z-index: 10;
  pointer-events: none;
  box-sizing: border-box;
}

/* ---- Tower Selection Bar ---- */

.tower-bar {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tower-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: rgba(10, 15, 30, 0.7);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 240, 255, 0.15);
  border-left: 3px solid currentColor;
  border-radius: 8px;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 140px;
  position: relative;
  overflow: hidden;
  color: inherit;
}

.tower-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 0%,
    rgba(0, 240, 255, 0.04) 100%
  );
  opacity: 0;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.tower-card:hover {
  transform: translateY(-4px);
  border-color: rgba(0, 240, 255, 0.4);
  background: rgba(10, 15, 30, 0.85);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(0, 240, 255, 0.12),
    inset 0 1px 0 rgba(0, 240, 255, 0.1);
}

.tower-card:hover::after {
  opacity: 1;
}

.tower-card:active {
  transform: translateY(-2px);
}

.tower-card.disabled {
  opacity: 0.35;
  cursor: not-allowed;
  filter: grayscale(0.8);
  pointer-events: auto;
}

.tower-card.disabled:hover {
  transform: none;
  border-color: rgba(0, 240, 255, 0.15);
  background: rgba(10, 15, 30, 0.7);
  box-shadow: none;
}

.tower-card.disabled::after {
  opacity: 0;
}

.tower-icon {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  box-shadow:
    0 0 10px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  position: relative;
  z-index: 1;
}

.tower-icon span {
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
}

.tower-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  z-index: 1;
}

.tower-name {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  letter-spacing: 0.8px;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.2);
}

.tower-cost {
  font-size: 11px;
  color: #fbbf24;
  letter-spacing: 0.3px;
  text-shadow: 0 0 6px rgba(251, 191, 36, 0.3);
}

/* ---- Selected Tower Info Panel ---- */

.selected-info {
  max-width: 380px;
  margin: 0 auto;
  padding: 20px;
  background: rgba(10, 15, 30, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  pointer-events: auto;
  box-shadow:
    0 0 40px rgba(0, 240, 255, 0.08),
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(0, 240, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.selected-info::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 20%;
  right: 20%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 240, 255, 0.5),
    transparent
  );
}

.sel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 240, 255, 0.1);
}

.sel-name {
  font-size: 16px;
  font-weight: 700;
  color: #00f0ff;
  letter-spacing: 1.5px;
  text-shadow: 0 0 12px rgba(0, 240, 255, 0.35);
}

.btn-close-sel {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.45);
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 700;
  padding: 0;
  line-height: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-close-sel:hover {
  color: #ff4466;
  border-color: rgba(255, 68, 102, 0.5);
  background: rgba(255, 68, 102, 0.1);
  box-shadow: 0 0 12px rgba(255, 68, 102, 0.2);
}

/* ---- Stats with Progress Bars ---- */

.sel-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-size: 11px;
  color: rgba(0, 240, 255, 0.55);
  width: 32px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
}

.stat-bar-wrap {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
}

.stat-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.stat-bar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 100%
  );
  border-radius: 3px 3px 0 0;
}

.stat-bar-damage {
  background: linear-gradient(90deg, #a855f7, #c084fc);
  box-shadow: 0 0 8px rgba(168, 85, 247, 0.4);
}

.stat-bar-range {
  background: linear-gradient(90deg, #00f0ff, #22d3ee);
  box-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.stat-bar-speed {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
  min-width: 48px;
  text-align: right;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.3px;
}

/* ---- Action Buttons ---- */

.sel-actions {
  display: flex;
  gap: 10px;
}

.btn-upgrade,
.btn-sell {
  flex: 1;
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.8px;
  position: relative;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.btn-upgrade::before,
.btn-sell::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.15) 0%,
    transparent 100%
  );
  pointer-events: none;
}

.btn-upgrade {
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  box-shadow:
    0 2px 8px rgba(59, 130, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-upgrade:hover {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
  box-shadow:
    0 4px 16px rgba(59, 130, 246, 0.4),
    0 0 20px rgba(59, 130, 246, 0.15);
  transform: translateY(-1px);
}

.btn-upgrade:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(59, 130, 246, 0.3);
}

.btn-upgrade.disabled {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.25);
  cursor: not-allowed;
  box-shadow: none;
  text-shadow: none;
}

.btn-upgrade.disabled::before {
  display: none;
}

.btn-upgrade.disabled:hover {
  transform: none;
  box-shadow: none;
}

.btn-sell {
  background: linear-gradient(135deg, #b91c1c, #ef4444);
  box-shadow:
    0 2px 8px rgba(239, 68, 68, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.btn-sell:hover {
  background: linear-gradient(135deg, #dc2626, #f87171);
  box-shadow:
    0 4px 16px rgba(239, 68, 68, 0.4),
    0 0 20px rgba(239, 68, 68, 0.15);
  transform: translateY(-1px);
}

.btn-sell:active {
  transform: translateY(0);
  box-shadow: 0 1px 4px rgba(239, 68, 68, 0.3);
}
</style>
