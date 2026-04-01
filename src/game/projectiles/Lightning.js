import Projectile from './Projectile'
import * as THREE from 'three'

export default class Lightning extends Projectile {
  constructor(scene, position, target, damage, speed) {
    super(scene, position, target, damage, speed, 'lightning')
  }

  _buildMesh() {
    // Lightning doesn't have a visible projectile - it's instant
    const geom = new THREE.SphereGeometry(0.05, 4, 4)
    const mat = new THREE.MeshBasicMaterial({ color: 0xffff44, transparent: true, opacity: 0 })
    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.position.copy(this.position)
    this.scene.add(this.mesh)
  }

  update() {
    // Lightning is instant - always hits immediately
    return true
  }
}
