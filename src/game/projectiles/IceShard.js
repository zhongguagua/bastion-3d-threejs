import Projectile from './Projectile'
import * as THREE from 'three'

export default class IceShard extends Projectile {
  constructor(scene, position, target, damage, speed) {
    super(scene, position, target, damage, speed, 'ice')
  }

  _buildMesh() {
    const geom = new THREE.OctahedronGeometry(0.12, 0)
    const mat = new THREE.MeshPhongMaterial({
      color: 0x66ccff,
      emissive: 0x224466,
      transparent: true,
      opacity: 0.8,
    })
    this.mesh = new THREE.Mesh(geom, mat)
    this.mesh.position.copy(this.position)
    this.scene.add(this.mesh)
  }

  update(dt) {
    const hit = super.update(dt)
    if (this.mesh) {
      this.mesh.rotation.x += dt * 10
      this.mesh.rotation.z += dt * 8
    }
    return hit
  }
}
