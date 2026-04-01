// ==========================================
// Tower Defense Game - Aura Effect
// ==========================================

import * as THREE from 'three'

export default class Aura {
  constructor(scene, position, radius, color) {
    this.scene = scene
    this.life = 1
    this.maxLife = 1

    const geom = new THREE.RingGeometry(Math.max(0.01, radius - 0.1), radius, 32)
    geom.rotateX(-Math.PI / 2)
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    })

    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.position.copy(position)
    this.mesh.position.y = 0.1
    this.scene.add(this.mesh)
  }
}
