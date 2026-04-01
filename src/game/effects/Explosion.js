// ==========================================
// Tower Defense Game - Explosion Effect
// ==========================================

import * as THREE from 'three'

export default class Explosion {
  constructor(scene, position, radius = 1) {
    this.scene = scene
    this.position = position.clone()
    this.radius = radius
    this.life = 0.5
    this.maxLife = 0.5

    this._build()
  }

  _build() {
    const count = 20
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = this.position.x
      positions[i * 3 + 1] = this.position.y
      positions[i * 3 + 2] = this.position.z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xff6633,
      size: 0.3,
      transparent: true,
      opacity: 1.0,
    })

    this.mesh = new THREE.Points(geometry, material)
    this.scene.add(this.mesh)
  }
}
