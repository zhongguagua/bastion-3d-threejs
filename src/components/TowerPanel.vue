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
        <span>伤害: {{ getCurrentStat('damage') }}</span>
        <span>射程: {{ getCurrentStat('range') }}</span>
        <span>攻速: {{ getCurrentStat('fireRate') }}s</span>
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
.tower-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px 20px;
  z-index: 10;
  pointer-events: none;
  box-sizing: border-box;
}

.tower-bar {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.tower-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s;
  min-width: 140px;
}

.tower-card:hover {
  border-color: rgba(68, 221, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.tower-card.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tower-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.tower-info {
  color: #fff;
}

.tower-name {
  font-size: 13px;
  font-weight: bold;
}

.tower-cost {
  font-size: 11px;
  color: #ffaa33;
}

.selected-info {
  max-width: 400px;
  margin: 0 auto;
  padding: 12px 18px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(68, 221, 255, 0.3);
  border-radius: 12px;
  color: #fff;
  pointer-events: auto;
}

.sel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.sel-name {
  font-size: 15px;
  font-weight: bold;
  color: #44ddff;
}

.btn-close-sel {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
}

.sel-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
}

.sel-actions {
  display: flex;
  gap: 10px;
}

.btn-upgrade {
  padding: 6px 16px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #2288ff, #00ccff);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-upgrade:hover {
  transform: translateY(-1px);
}

.btn-upgrade.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-sell {
  padding: 6px 16px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  background: linear-gradient(135deg, #cc4444, #ff6644);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sell:hover {
  transform: translateY(-1px);
}
</style>
