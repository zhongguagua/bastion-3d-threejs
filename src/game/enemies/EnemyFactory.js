// ==========================================
// Tower Defense Game - Enemy Factory
// ==========================================

import { ENEMY } from '../core/Constants'
import NormalEnemy from './NormalEnemy'
import FastEnemy from './FastEnemy'
import TankEnemy from './TankEnemy'
import FlyingEnemy from './FlyingEnemy'
import BossEnemy from './BossEnemy'

export default class EnemyFactory {
  constructor(scene) {
    this.scene = scene
  }

  create(type, hpMultiplier = 1) {
    switch (type) {
      case ENEMY.TYPES.NORMAL:
        return new NormalEnemy(this.scene, hpMultiplier)
      case ENEMY.TYPES.FAST:
        return new FastEnemy(this.scene, hpMultiplier)
      case ENEMY.TYPES.TANK:
        return new TankEnemy(this.scene, hpMultiplier)
      case ENEMY.TYPES.FLYING:
        return new FlyingEnemy(this.scene, hpMultiplier)
      case ENEMY.TYPES.BOSS:
        return new BossEnemy(this.scene, hpMultiplier)
      default:
        console.warn(`Unknown enemy type: ${type}`)
        return new NormalEnemy(this.scene, hpMultiplier)
    }
  }
}
