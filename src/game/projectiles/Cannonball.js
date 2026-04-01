import Projectile from './Projectile'
import * as THREE from 'three'

export default class Cannonball extends Projectile {
  constructor(scene, position, target, damage, speed) {
    super(scene, position, target, damage, speed, 'cannon')
  }

  _buildMesh() {
    const geom = new THREE.SphereGeometry(0.15, 8, 6)
    const mat = new THREE.MeshPhongMaterial({ color: 0x333333, shininess: 50 })
    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.position.copy(this.position)
    this.scene.add(this.mesh)
  }
}
