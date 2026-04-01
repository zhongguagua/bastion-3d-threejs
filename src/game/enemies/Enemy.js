// ==========================================
// Tower Defense Game - Enemy Base Class
// ==========================================

import * as THREE from 'three'

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
    this.emissive = config.emissive || 0x000000
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
    this.hpSprite = null
    this.hpCanvas = null
    this.hpTexture = null

    this._buildMesh()
    this._buildHpBar()
  }

  _buildMesh() {
    // Override in subclass
    const geom = new THREE.BoxGeometry(this.size * 2, this.size * 2, this.size * 2)
    const mat = new THREE.MeshStandardMaterial({
      color: this.color,
      emissive: this.emissive,
      roughness: 0.6,
      metalness: 0.2,
    })
    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.castShadow = true
    this.scene.add(this.mesh)
  }

  _buildHpBar() {
    // Create canvas-based sprite for HP bar (always faces camera)
    this.hpCanvas = document.createElement('canvas')
    this.hpCanvas.width = 128
    this.hpCanvas.height = 24

    this.hpTexture = new THREE.CanvasTexture(this.hpCanvas)
    this.hpTexture.minFilter = THREE.LinearFilter

    const spriteMat = new THREE.SpriteMaterial({
      map: this.hpTexture,
      transparent: true,
      depthTest: false,
    })
    this.hpSprite = new THREE.Sprite(spriteMat)
    this.hpSprite.scale.set(1.6, 0.3, 1)
    this.hpSprite.position.y = this.size + 1.2
    this.scene.add(this.hpSprite)

    this._drawHpBar()
  }

  _drawHpBar() {
    const ctx = this.hpCanvas.getContext('2d')
    const w = this.hpCanvas.width
    const h = this.hpCanvas.height
    const ratio = Math.max(0, this.hp / this.maxHp)

    // Clear
    ctx.clearRect(0, 0, w, h)

    // Background with rounded rect
    ctx.fillStyle = '#111111'
    this._roundRect(ctx, 2, 2, w - 4, h - 4, 4)
    ctx.fill()

    // Border
    ctx.strokeStyle = '#333333'
    ctx.lineWidth = 1
    this._roundRect(ctx, 2, 2, w - 4, h - 4, 4)
    ctx.stroke()

    // HP fill
    if (ratio > 0) {
      const fillW = Math.max(0, (w - 8) * ratio)
      let fillColor
      if (ratio > 0.6) {
        fillColor = '#33dd55'
      } else if (ratio > 0.3) {
        fillColor = '#ddaa33'
      } else {
        fillColor = '#dd3333'
      }

      ctx.fillStyle = fillColor
      this._roundRect(ctx, 4, 4, fillW, h - 8, 3)
      ctx.fill()

      // Highlight on top half of fill
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
      this._roundRect(ctx, 4, 4, fillW, (h - 8) / 2, 3)
      ctx.fill()
    }

    this.hpTexture.needsUpdate = true
  }

  _roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + r)
    ctx.lineTo(x + w, y + h - r)
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
    ctx.lineTo(x + r, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - r)
    ctx.lineTo(x, y + r)
    ctx.quadraticCurveTo(x, y, x + r, y)
    ctx.closePath()
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

    // Update HP sprite position (sprite automatically faces camera)
    this.hpSprite.position.x = this.mesh.position.x
    this.hpSprite.position.z = this.mesh.position.z
    this.hpSprite.position.y = (this.flying ? this.flyHeight : 0) + this.size + 1.2
  }

  _updateHpBar() {
    this._drawHpBar()
  }

  takeDamage(amount) {
    this.hp -= amount
    if (this.hp <= 0) {
      this.hp = 0
      this.isDead = true
    }
    this._updateHpBar()
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
    if (this.hpSprite) {
      this.scene.remove(this.hpSprite)
      if (this.hpTexture) this.hpTexture.dispose()
      if (this.hpSprite.material) this.hpSprite.material.dispose()
    }
  }
}
