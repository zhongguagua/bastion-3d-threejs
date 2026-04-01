import Projectile from './Projectile'
import * as THREE from 'three'

export default class SniperBullet extends Projectile {
  constructor(scene, position, target, damage, speed) {
    super(scene, position, target, damage, speed, 'sniper')
  }

  _buildMesh() {
    const group = new THREE.Group()

    // Bullet trail
    const trailGeom = new THREE.CylinderGeometry(0.02, 0.04, 0.8, 4)
    trailGeom.rotateX(Math.PI / 2)
    const trailMat = new THREE.MeshBasicMaterial({
      color: 0xff4466,
      transparent: true,
      opacity: 0.9,
    })
    const trail = new THREE.Mesh(trailGeom, trailMat)
    group.add(trail)

    // Glow
    const glowGeom = new THREE.SphereGeometry(0.08, 6, 4)
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xff8899 })
    const glow = new THREE.Mesh(glowGeom, glowMat)
    glow.position.z = -0.4
    group.add(glow)

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
