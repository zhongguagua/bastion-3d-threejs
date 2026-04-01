// ==========================================
// Tower Defense Game - Projectile Base Class
// ==========================================

import * as THREE from 'three'

export default class Projectile {
  constructor(scene, position, target, damage, speed, type, tower) {
    this.scene = scene
    this.position = position.clone()
    this.target = target
    this.damage = damage
    this.speed = speed
    this.type = type
    this.tower = tower
    this.mesh = null
    this.expired = false
    this.maxLifetime = 5 // seconds
    this.lifetime = 0

    this._buildMesh()
  }

  _buildMesh() {
    const geom = new THREE.SphereGeometry(0.1, 6, 4)
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.position.copy(this.position)
    this.scene.add(this.mesh)
  }

  update(dt) {
    this.lifetime += dt
    if (this.lifetime > this.maxLifetime) {
      this.expired = true
      return false
    }

    // Check if target is still valid
    if (!this.target || this.target.isDead || this.target.reachedEnd) {
      this.expired = true
      return false
    }

    // Move towards target
    const targetPos = this.target.mesh.position.clone()
    const direction = targetPos.sub(this.position).normalize()
    const moveDistance = this.speed * dt

    this.position.add(direction.multiplyScalar(moveDistance))
    this.mesh.position.copy(this.position)

    // Check if reached target
    const dist = this.position.distanceTo(this.target.mesh.position)
    if (dist < 0.5) {
      return true // Hit!
    }

    return false
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
  }
}
