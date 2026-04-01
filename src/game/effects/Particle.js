// ==========================================
// Tower Defense Game - Particle Effect
// ==========================================

import * as THREE from 'three'

export default class Particle {
  constructor(scene, position, color, count = 10) {
    this.scene = scene
    this.life = 0.5
    this.maxLife = 0.5

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x
      positions[i * 3 + 1] = position.y
      positions[i * 3 + 2] = position.z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.15,
      transparent: true,
      opacity: 1.0,
    })

    this.mesh = new THREE.Points(geometry, material)
    this.scene.add(this.mesh)
  }
}
