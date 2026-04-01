// ==========================================
// Tower Defense Game - Effect Manager
// ==========================================

import * as THREE from 'three'

export default class EffectManager {
  constructor(scene) {
    this.scene = scene
    this.effects = []
  }

  // eslint-disable-next-line no-unused-vars
  createExplosion(position, radius) {
    const count = 20
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const velocities = []

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x
      positions[i * 3 + 1] = position.y
      positions[i * 3 + 2] = position.z
      velocities.push(
        (Math.random() - 0.5) * 8,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 8
      )
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xff6633,
      size: 0.2,
      transparent: true,
      opacity: 1.0,
    })

    const particles = new THREE.Points(geometry, material)
    this.scene.add(particles)

    this.effects.push({
      type: 'explosion',
      mesh: particles,
      velocities,
      life: 0.6,
      maxLife: 0.6,
    })
  }

  createHitEffect(position, type) {
    let color = 0xffffff
    let count = 8
    switch (type) {
      case 'arrow': color = 0xccaa66; break
      case 'cannon': color = 0xff6633; count = 12; break
      case 'ice': color = 0x66ccff; break
      case 'lightning': color = 0xffff44; count = 6; break
      case 'sniper': color = 0xff4466; count = 5; break
    }

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const velocities = []

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x
      positions[i * 3 + 1] = position.y
      positions[i * 3 + 2] = position.z
      velocities.push(
        (Math.random() - 0.5) * 5,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * 5
      )
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.15,
      transparent: true,
      opacity: 1.0,
    })

    const particles = new THREE.Points(geometry, material)
    this.scene.add(particles)

    this.effects.push({
      type: 'hit',
      mesh: particles,
      velocities,
      life: 0.4,
      maxLife: 0.4,
    })
  }

  createDeathEffect(enemy) {
    const count = 15
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const velocities = []

    for (let i = 0; i < count; i++) {
      positions[i * 3] = enemy.mesh.position.x
      positions[i * 3 + 1] = enemy.mesh.position.y + 0.5
      positions[i * 3 + 2] = enemy.mesh.position.z
      velocities.push(
        (Math.random() - 0.5) * 6,
        Math.random() * 5 + 2,
        (Math.random() - 0.5) * 6
      )
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: enemy.color,
      size: 0.2,
      transparent: true,
      opacity: 1.0,
    })

    const particles = new THREE.Points(geometry, material)
    this.scene.add(particles)

    this.effects.push({
      type: 'death',
      mesh: particles,
      velocities,
      life: 0.8,
      maxLife: 0.8,
    })
  }

  createLightningBolt(from, to) {
    const points = []
    const segments = 8
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const x = from.x + (to.x - from.x) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * 0.8 : 0)
      const y = from.y + (to.y - from.y) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * 0.8 : 0)
      const z = from.z + (to.z - from.z) * t + (i > 0 && i < segments ? (Math.random() - 0.5) * 0.8 : 0)
      points.push(new THREE.Vector3(x, y, z))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: 0xffff44,
      transparent: true,
      opacity: 1.0,
    })

    const line = new THREE.Line(geometry, material)
    this.scene.add(line)

    this.effects.push({
      type: 'lightning',
      mesh: line,
      life: 0.15,
      maxLife: 0.15,
    })
  }

  update(dt) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i]
      effect.life -= dt

      if (effect.life <= 0) {
        this.scene.remove(effect.mesh)
        if (effect.mesh.geometry) effect.mesh.geometry.dispose()
        if (effect.mesh.material) effect.mesh.material.dispose()
        this.effects.splice(i, 1)
        continue
      }

      const progress = 1 - effect.life / effect.maxLife

      if (effect.type === 'explosion' || effect.type === 'hit' || effect.type === 'death') {
        const positions = effect.mesh.geometry.attributes.position.array
        for (let j = 0; j < positions.length / 3; j++) {
          positions[j * 3] += effect.velocities[j * 3] * dt
          positions[j * 3 + 1] += effect.velocities[j * 3 + 1] * dt
          positions[j * 3 + 2] += effect.velocities[j * 3 + 2] * dt
          // Gravity
          effect.velocities[j * 3 + 1] -= 15 * dt
        }
        effect.mesh.geometry.attributes.position.needsUpdate = true
        effect.mesh.material.opacity = 1 - progress
      }

      if (effect.type === 'lightning') {
        effect.mesh.material.opacity = effect.life / effect.maxLife
      }
    }
  }

  clear() {
    this.effects.forEach(effect => {
      this.scene.remove(effect.mesh)
      if (effect.mesh.geometry) effect.mesh.geometry.dispose()
      if (effect.mesh.material) effect.mesh.material.dispose()
    })
    this.effects = []
  }
}
