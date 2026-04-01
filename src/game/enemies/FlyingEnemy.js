import Enemy from './Enemy'
import * as THREE from 'three'
import { ENEMY_STATS, ENEMY } from '../core/Constants'

export default class FlyingEnemy extends Enemy {
  constructor(scene, hpMultiplier = 1) {
    const stats = ENEMY_STATS[ENEMY.TYPES.FLYING]
    super(scene, {
      type: ENEMY.TYPES.FLYING,
      hp: stats.baseHp * hpMultiplier,
      speed: stats.speed,
      reward: stats.reward,
      size: stats.size,
      color: stats.color,
      flying: true,
      flyHeight: stats.flyHeight,
    })
  }

  _buildMesh() {
    const group = new THREE.Group()

    // Body
    const bodyGeom = new THREE.SphereGeometry(0.25, 6, 4)
    const bodyMat = new THREE.MeshPhongMaterial({ color: this.color, flatShading: true })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.25
    body.castShadow = true
    group.add(body)

    // Wings
    const wingGeom = new THREE.PlaneGeometry(1.0, 0.3)
    const wingMat = new THREE.MeshPhongMaterial({
      color: 0x44bbdd,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    })
    const leftWing = new THREE.Mesh(wingGeom, wingMat)
    leftWing.position.set(-0.4, 0.3, 0)
    leftWing.rotation.z = 0.3
    leftWing.name = 'leftWing'
    group.add(leftWing)

    const rightWing = new THREE.Mesh(wingGeom, wingMat.clone())
    rightWing.position.set(0.4, 0.3, 0)
    rightWing.rotation.z = -0.3
    rightWing.name = 'rightWing'
    group.add(rightWing)

    this.mesh = group
    this.scene.add(this.mesh)
  }

  update(dt, path) {
    super.update(dt, path)

    // Animate wings
    if (this.mesh) {
      const time = Date.now() * 0.01
      this.mesh.traverse(child => {
        if (child.name === 'leftWing') {
          child.rotation.z = 0.3 + Math.sin(time) * 0.4
        } else if (child.name === 'rightWing') {
          child.rotation.z = -0.3 - Math.sin(time) * 0.4
        }
      })
    }
  }
}
