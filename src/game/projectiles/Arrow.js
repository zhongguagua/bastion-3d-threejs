import Projectile from './Projectile'
import * as THREE from 'three'

export default class Arrow extends Projectile {
  constructor(scene, position, target, damage, speed, tower) {
    super(scene, position, target, damage, speed, 'arrow', tower)
  }

  _buildMesh() {
    const group = new THREE.Group()

    // Arrow shaft
    const shaftGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.6, 4)
    shaftGeom.rotateX(Math.PI / 2)
    const shaftMat = new THREE.MeshBasicMaterial({ color: 0xccaa66 })
    const shaft = new THREE.Mesh(shaftGeom, shaftMat)
    group.add(shaft)

    // Arrow head
    const headGeom = new THREE.ConeGeometry(0.06, 0.15, 4)
    headGeom.rotateX(Math.PI / 2)
    const headMat = new THREE.MeshBasicMaterial({ color: 0xcccccc })
    const head = new THREE.Mesh(headGeom, headMat)
    head.position.z = -0.35
    group.add(head)

    group.position.copy(this.position)
    this.mesh = group
    this.scene.add(this.mesh)
  }

  update(dt) {
    const hit = super.update(dt)
    if (this.mesh && this.target && !this.target.isDead) {
      this.mesh.lookAt(this.target.mesh.position)
    }
    return hit
  }
}
