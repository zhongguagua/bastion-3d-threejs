// ==========================================
// Tower Defense Game - Effect Manager
// ==========================================

import * as THREE from 'three'

export default class EffectManager {
  constructor(scene) {
    this.scene = scene
    this.effects = []
  }

  /**
   * Helper: fully dispose of an effect mesh (supports Groups, Points, Lines, Meshes).
   * Traverses children and disposes all geometries and materials.
   */
  _disposeEffect(effect) {
    const mesh = effect.mesh
    if (!mesh) return

    if (mesh.isGroup) {
      mesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose()
        if (child.material) child.material.dispose()
      })
    } else {
      if (mesh.geometry) mesh.geometry.dispose()
      if (mesh.material) mesh.material.dispose()
    }

    // Dispose additional meshes stored on the effect
    if (effect.glowMesh) {
      if (effect.glowMesh.geometry) effect.glowMesh.geometry.dispose()
      if (effect.glowMesh.material) effect.glowMesh.material.dispose()
    }
    if (effect.ringMesh) {
      if (effect.ringMesh.geometry) effect.ringMesh.geometry.dispose()
      if (effect.ringMesh.material) effect.ringMesh.material.dispose()
    }
    if (effect.flashSphere) {
      if (effect.flashSphere.geometry) effect.flashSphere.geometry.dispose()
      if (effect.flashSphere.material) effect.flashSphere.material.dispose()
    }
  }

  // eslint-disable-next-line no-unused-vars
  createExplosion(position, radius) {
    // --- Main explosion particles (orange-red-yellow variety) ---
    const count = 35
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const velocities = []
    const colors = new Float32Array(count * 3)

    const colorPalette = [
      new THREE.Color(0xff6633), // orange
      new THREE.Color(0xff3300), // red-orange
      new THREE.Color(0xffaa00), // yellow-orange
      new THREE.Color(0xffcc33), // yellow
      new THREE.Color(0xff4400), // deep orange-red
    ]

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x
      positions[i * 3 + 1] = position.y
      positions[i * 3 + 2] = position.z
      velocities.push(
        (Math.random() - 0.5) * 10,
        Math.random() * 7 + 2,
        (Math.random() - 0.5) * 10
      )
      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = c.r
      colors[i * 3 + 1] = c.g
      colors[i * 3 + 2] = c.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.35,
      transparent: true,
      opacity: 1.0,
      vertexColors: true,
      sizeAttenuation: true,
    })

    const particles = new THREE.Points(geometry, material)
    this.scene.add(particles)

    this.effects.push({
      type: 'explosion',
      mesh: particles,
      velocities,
      life: 0.7,
      maxLife: 0.7,
    })

    // --- Secondary orange spark particles ---
    const sparkCount = 15
    const sparkGeo = new THREE.BufferGeometry()
    const sparkPos = new Float32Array(sparkCount * 3)
    const sparkVel = []

    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = position.x
      sparkPos[i * 3 + 1] = position.y + 0.2
      sparkPos[i * 3 + 2] = position.z
      sparkVel.push(
        (Math.random() - 0.5) * 12,
        Math.random() * 9 + 3,
        (Math.random() - 0.5) * 12
      )
    }

    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3))

    const sparkMat = new THREE.PointsMaterial({
      color: 0xff9944,
      size: 0.18,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    })

    const sparks = new THREE.Points(sparkGeo, sparkMat)
    this.scene.add(sparks)

    this.effects.push({
      type: 'explosion',
      mesh: sparks,
      velocities: sparkVel,
      life: 0.5,
      maxLife: 0.5,
    })

    // --- Flash ring (expanding torus that fades out) ---
    const ringGeo = new THREE.TorusGeometry(0.3, 0.08, 8, 24)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0.9,
    })

    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.copy(position)
    ring.position.y += 0.3
    // Rotate the torus to be roughly horizontal
    ring.rotation.x = Math.PI / 2
    this.scene.add(ring)

    this.effects.push({
      type: 'flashRing',
      mesh: ring,
      life: 0.5,
      maxLife: 0.5,
    })
  }

  createHitEffect(position, type) {
    let color = 0xffffff
    let count = 12
    switch (type) {
      case 'arrow': color = 0xccaa66; count = 12; break
      case 'cannon': color = 0xff6633; count = 18; break
      case 'ice': color = 0x66ccff; count = 12; break
      case 'lightning': color = 0xffff44; count = 9; break
      case 'sniper': color = 0xff4466; count = 8; break
    }

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const velocities = []

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x
      positions[i * 3 + 1] = position.y
      positions[i * 3 + 2] = position.z
      velocities.push(
        (Math.random() - 0.5) * 6,
        Math.random() * 4 + 1,
        (Math.random() - 0.5) * 6
      )
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.25,
      transparent: true,
      opacity: 1.0,
      sizeAttenuation: true,
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
    const count = 25
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const velocities = []
    const colors = new Float32Array(count * 3)

    const baseColor = new THREE.Color(enemy.color || 0xff4444)
    // Create color variations around the base enemy color
    const hsl = {}
    baseColor.getHSL(hsl)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = enemy.mesh.position.x
      positions[i * 3 + 1] = enemy.mesh.position.y + 0.5
      positions[i * 3 + 2] = enemy.mesh.position.z
      velocities.push(
        (Math.random() - 0.5) * 7,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 7
      )

      // Vary hue and lightness slightly for each particle
      const varied = new THREE.Color()
      varied.setHSL(
        (hsl.h + (Math.random() - 0.5) * 0.1 + 1) % 1,
        Math.min(1, hsl.s + (Math.random() - 0.5) * 0.2),
        Math.min(1, Math.max(0, hsl.l + (Math.random() - 0.5) * 0.3))
      )
      colors[i * 3] = varied.r
      colors[i * 3 + 1] = varied.g
      colors[i * 3 + 2] = varied.b
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: 0.35,
      transparent: true,
      opacity: 1.0,
      vertexColors: true,
      sizeAttenuation: true,
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

    // --- Brief flash sphere that expands and fades ---
    const flashGeo = new THREE.SphereGeometry(0.4, 12, 8)
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    })

    const flashSphere = new THREE.Mesh(flashGeo, flashMat)
    flashSphere.position.copy(enemy.mesh.position)
    flashSphere.position.y += 0.5
    this.scene.add(flashSphere)

    this.effects.push({
      type: 'flashSphere',
      mesh: flashSphere,
      life: 0.3,
      maxLife: 0.3,
    })
  }

  createLightningBolt(from, to) {
    const segments = 12
    const jitter = 1.2

    // Generate the zigzag points
    const points = []
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const j = (i > 0 && i < segments) ? (Math.random() - 0.5) * jitter : 0
      const x = from.x + (to.x - from.x) * t + j
      const y = from.y + (to.y - from.y) * t + j
      const z = from.z + (to.z - from.z) * t + j
      points.push(new THREE.Vector3(x, y, z))
    }

    // --- Glow line (wider, more translucent white-yellow, behind main bolt) ---
    const glowGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const glowMaterial = new THREE.LineBasicMaterial({
      color: 0xffffaa,
      transparent: true,
      opacity: 0.35,
    })

    const glowLine = new THREE.Line(glowGeometry, glowMaterial)
    this.scene.add(glowLine)

    // --- Main bright yellow bolt ---
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
      glowMesh: glowLine,
      life: 0.2,
      maxLife: 0.2,
    })
  }

  update(dt) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const effect = this.effects[i]
      effect.life -= dt

      if (effect.life <= 0) {
        this.scene.remove(effect.mesh)
        // Also remove glow/ring/flash meshes if present
        if (effect.glowMesh) this.scene.remove(effect.glowMesh)
        if (effect.ringMesh) this.scene.remove(effect.ringMesh)
        if (effect.flashSphere) this.scene.remove(effect.flashSphere)
        this._disposeEffect(effect)
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

      if (effect.type === 'flashRing') {
        // Scale the ring up over time and fade out
        const scale = 1 + progress * 4
        effect.mesh.scale.set(scale, scale, scale)
        effect.mesh.material.opacity = Math.max(0, (1 - progress) * 0.9)
      }

      if (effect.type === 'flashSphere') {
        // Expand and fade the flash sphere
        const scale = 1 + progress * 2
        effect.mesh.scale.set(scale, scale, scale)
        effect.mesh.material.opacity = Math.max(0, (1 - progress) * 0.7)
      }

      if (effect.type === 'lightning') {
        const fadeRatio = effect.life / effect.maxLife
        effect.mesh.material.opacity = fadeRatio
        if (effect.glowMesh) {
          effect.glowMesh.material.opacity = fadeRatio * 0.35
        }
      }
    }
  }

  clear() {
    this.effects.forEach((effect) => {
      this.scene.remove(effect.mesh)
      if (effect.glowMesh) this.scene.remove(effect.glowMesh)
      if (effect.ringMesh) this.scene.remove(effect.ringMesh)
      if (effect.flashSphere) this.scene.remove(effect.flashSphere)
      this._disposeEffect(effect)
    })
    this.effects = []
  }
}
