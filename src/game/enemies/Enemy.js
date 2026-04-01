// ==========================================
// Tower Defense Game - Enemy Base Class
// ==========================================

import * as THREE from 'three'
import { COLOR } from '../core/Constants'

export default class Enemy {
  constructor(scene, config) {
    this.scene = scene
    this.type = config.type
    this.hp = config.hp
    this.maxHp = config.hp
    this.speed = config.speed
    this.baseSpeed = config.speed
    this.reward = config.reward
    this.size = config.size
    this.color = config.color
    this.flying = config.flying || false
    this.flyHeight = config.flyHeight || 0

    // State
    this.distanceTraveled = 0
    this.reachedEnd = false
    this.isDead = false
    this.slowFactor = 1.0
    this.slowTimer = 0

    // 3D objects
    this.mesh = null
    this.hpBarGroup = null
    this.hpBarBg = null
    this.hpBarFg = null

    this._buildMesh()
    this._buildHpBar()
  }

  _buildMesh() {
    // Override in subclass
    const geom = new THREE.BoxGeometry(this.size * 2, this.size * 2, this.size * 2)
    const mat = new THREE.MeshPhongMaterial({
      color: this.color,
      flatShading: true,
    })
    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.castShadow = true
    this.scene.add(this.mesh)
  }

  _buildHpBar() {
    this.hpBarGroup = new THREE.Group()

    // Background bar
    const bgGeom = new THREE.PlaneGeometry(1.2, 0.15)
    const bgMat = new THREE.MeshBasicMaterial({ color: COLOR.HP_BAR_BG, side: THREE.DoubleSide })
    this.hpBarBg = new THREE.Mesh(bgGeom, bgMat)
    this.hpBarGroup.add(this.hpBarBg)

    // Foreground bar
    const fgGeom = new THREE.PlaneGeometry(1.18, 0.12)
    const fgMat = new THREE.MeshBasicMaterial({ color: COLOR.HP_BAR_FG, side: THREE.DoubleSide })
    this.hpBarFg = new THREE.Mesh(fgGeom, fgMat)
    this.hpBarFg.position.z = 0.001
    this.hpBarGroup.add(this.hpBarFg)

    this.hpBarGroup.position.y = this.size + 1.0
    this.scene.add(this.hpBarGroup)
  }

  update(dt, path) {
    if (this.isDead || this.reachedEnd) return

    // Update slow
    if (this.slowTimer > 0) {
      this.slowTimer -= dt
      if (this.slowTimer <= 0) {
        this.slowFactor = 1.0
      }
    }

    // Move along path
    const moveSpeed = this.speed * this.slowFactor * dt
    this.distanceTraveled += moveSpeed

    const totalLength = path.totalLength
    if (this.distanceTraveled >= totalLength) {
      this.reachedEnd = true
      return
    }

    const position = path.getPositionAtDistance(this.distanceTraveled)
    this.mesh.position.copy(position)
    if (this.flying) {
      this.mesh.position.y += this.flyHeight
    }

    // Face direction of movement
    const dir = path.getDirectionAtDistance(this.distanceTraveled)
    if (dir.lengthSq() > 0) {
      this.mesh.lookAt(
        this.mesh.position.x + dir.x,
        this.mesh.position.y,
        this.mesh.position.z + dir.z
      )
    }

    // Update HP bar position
    this.hpBarGroup.position.x = this.mesh.position.x
    this.hpBarGroup.position.y = (this.flying ? this.flyHeight : 0) + this.size + 1.0
    this.hpBarGroup.position.z = this.mesh.position.z
    this.hpBarGroup.lookAt(
      this.hpBarGroup.position.x,
      this.hpBarGroup.position.y + 10,
      this.hpBarGroup.position.z + 10
    )
    // Make HP bar face camera (billboard) - we just rotate it to be visible

    this._updateHpBar()
  }

  _updateHpBar() {
    const ratio = Math.max(0, this.hp / this.maxHp)
    this.hpBarFg.scale.x = Math.max(0.01, ratio)
    this.hpBarFg.position.x = -(1.18 * (1 - ratio)) / 2

    if (ratio < 0.3) {
      this.hpBarFg.material.color.setHex(COLOR.HP_BAR_LOW)
    } else {
      this.hpBarFg.material.color.setHex(COLOR.HP_BAR_FG)
    }
  }

  takeDamage(amount) {
    this.hp -= amount
    if (this.hp <= 0) {
      this.hp = 0
      this.isDead = true
    }
  }

  applySlow(factor, duration) {
    if (factor < this.slowFactor) {
      this.slowFactor = factor
    }
    this.slowTimer = Math.max(this.slowTimer, duration)
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
        if (this.mesh.geometry) this.mesh.geometry.dispose()
        if (this.mesh.material) this.mesh.material.dispose()
      }
    }
    if (this.hpBarGroup) {
      this.scene.remove(this.hpBarGroup)
      this.hpBarGroup.traverse(child => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) child.material.dispose()
      })
    }
  }
}
