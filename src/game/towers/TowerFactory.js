// ==========================================
// Tower Defense Game - Tower Factory
// ==========================================

import { TOWER } from '../core/Constants'
import ArrowTower from './ArrowTower'
import CannonTower from './CannonTower'
import IceTower from './IceTower'
import LightningTower from './LightningTower'
import SniperTower from './SniperTower'

export default class TowerFactory {
  constructor(scene) {
    this.scene = scene
  }

  create(type, col, row) {
    switch (type) {
      case TOWER.TYPES.ARROW:
        return new ArrowTower(this.scene, col, row)
      case TOWER.TYPES.CANNON:
        return new CannonTower(this.scene, col, row)
      case TOWER.TYPES.ICE:
        return new IceTower(this.scene, col, row)
      case TOWER.TYPES.LIGHTNING:
        return new LightningTower(this.scene, col, row)
      case TOWER.TYPES.SNIPER:
        return new SniperTower(this.scene, col, row)
      default:
        console.warn(`Unknown tower type: ${type}`)
        return new ArrowTower(this.scene, col, row)
    }
  }
}
