// ==========================================
// Tower Defense Game - Tower Base Class
// ==========================================

import * as THREE from 'three'
import { GRID, TOWER_STATS } from '../core/Constants'

export default class Tower {
  constructor(scene, type, col, row) {
    this.scene = scene
    this.type = type
    this.gridCol = col
    this.gridRow = row
    this.level = 0 // 0-indexed, 0 = level 1
    this.mesh = null
    this.fireTimer = 0
    this.target = null
    this.range = 0
    this.damage = 0
    this.fireRate = 0

    this._applyStats()
    this._buildMesh()
  }

  _applyStats() {
    const stats = TOWER_STATS[this.type]
    this.range = stats.range[this.level]
    this.damage = stats.damage[this.level]
    this.fireRate = stats.fireRate[this.level]
  }

  _buildMesh() {
    // Override in subclass
    const pos = this._getWorldPos()
    const geom = new THREE.CylinderGeometry(0.5, 0.7, 1.5, 8)
    const mat = new THREE.MeshPhongMaterial({ color: 0x888888 })
    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.position.copy(pos)
    this.mesh.position.y = 0.75
    this.mesh.castShadow = true
    this.scene.add(this.mesh)
  }

  _getWorldPos() {
    return new THREE.Vector3(
      this.gridCol * GRID.CELL_SIZE + GRID.CELL_SIZE / 2,
      0,
      this.gridRow * GRID.CELL_SIZE + GRID.CELL_SIZE / 2
    )
  }

  upgrade() {
    if (this.level >= 2) return false
    this.level++
    this._applyStats()
    this._updateVisual()
    return true
  }

  _updateVisual() {
    // Override in subclass for upgrade visuals
    const stats = TOWER_STATS[this.type]
    if (this.mesh && this.mesh.material) {
      this.mesh.material.color.setHex(stats.color[this.level])
    }
  }

  update(dt, enemies) {
    this.fireTimer += dt

    // Find target
    this.target = this._findTarget(enemies)

    // Face target
    if (this.target) {
      this._lookAtTarget(this.target)
    }

    // Fire
    if (this.target && this.fireTimer >= this.fireRate) {
      this.fireTimer = 0
      const projectile = this._fire(this.target)
      if (projectile) {
        projectile.tower = this
      }
      return projectile
    }

    return null
  }

  _findTarget(enemies) {
    let closest = null
    let closestProgress = -1

    for (const enemy of enemies) {
      if (enemy.isDead || enemy.reachedEnd) continue

      const dist = this.mesh.position.distanceTo(enemy.mesh.position)
      if (dist <= this.range) {
        // Prioritize enemies furthest along the path
        if (enemy.distanceTraveled > closestProgress) {
          closestProgress = enemy.distanceTraveled
          closest = enemy
        }
      }
    }

    return closest
  }

  _lookAtTarget(target) {
    const pos = this.mesh.position.clone()
    const targetPos = target.mesh.position.clone()
    targetPos.y = pos.y
    this.mesh.lookAt(targetPos)
  }

  _fire() {
    // Override in subclass to return projectile
    return null
  }

  getSplashRadius() {
    const stats = TOWER_STATS[this.type]
    return stats.splashRadius ? stats.splashRadius[this.level] : 0
  }

  getSlowFactor() {
    const stats = TOWER_STATS[this.type]
    return stats.slowFactor ? stats.slowFactor[this.level] : 1.0
  }

  getSlowDuration() {
    const stats = TOWER_STATS[this.type]
    return stats.slowDuration ? stats.slowDuration[this.level] : 0
  }

  getChainCount() {
    const stats = TOWER_STATS[this.type]
    return stats.chainCount ? stats.chainCount[this.level] : 0
  }

  destroy() {
    if (this.mesh) {
      this.scene.remove(this.mesh)
      if (this.mesh.traverse) {
        this.mesh.traverse(child => {
          if (child.geometry) child.geometry.dispose()
          if (child.material) child.material.dispose()
        })
      } else {
        this.mesh.geometry.dispose()
        this.mesh.material.dispose()
      }
    }
  }
}
