import Enemy from './Enemy'
import * as THREE from 'three'
import { ENEMY_STATS, ENEMY } from '../core/Constants'

export default class FastEnemy extends Enemy {
  constructor(scene, hpMultiplier = 1) {
    const stats = ENEMY_STATS[ENEMY.TYPES.FAST]
    super(scene, {
      type: ENEMY.TYPES.FAST,
      hp: stats.baseHp * hpMultiplier,
      speed: stats.speed,
      reward: stats.reward,
      size: stats.size,
      color: stats.color,
      flying: stats.flying,
    })
  }

  _buildMesh() {
    const group = new THREE.Group()

    // Slim body
    const bodyGeom = new THREE.ConeGeometry(0.25, 0.8, 6)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: this.color,
      emissive: this.emissive || 0x442200,
      roughness: 0.5,
      metalness: 0.2,
    })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.4
    body.castShadow = true
    group.add(body)

    // Trail effect
    const trailGeom = new THREE.ConeGeometry(0.15, 0.5, 4)
    const trailMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.6,
    })
    const trail = new THREE.Mesh(trailGeom, trailMat)
    trail.position.y = 0.15
    trail.rotation.x = Math.PI
    group.add(trail)

    // Speed lines - motion blur effect behind the body
    const speedLineMat = new THREE.MeshBasicMaterial({
      color: 0xffee66,
      transparent: true,
      opacity: 0.4,
    })

    const speedLine1Geom = new THREE.BoxGeometry(0.04, 0.02, 0.6)
    const speedLine1 = new THREE.Mesh(speedLine1Geom, speedLineMat)
    speedLine1.position.set(-0.1, 0.35, 0.3)
    group.add(speedLine1)

    const speedLine2Geom = new THREE.BoxGeometry(0.04, 0.02, 0.5)
    const speedLine2 = new THREE.Mesh(speedLine2Geom, speedLineMat)
    speedLine2.position.set(0.1, 0.45, 0.25)
    group.add(speedLine2)

    const speedLine3Geom = new THREE.BoxGeometry(0.04, 0.02, 0.4)
    const speedLine3 = new THREE.Mesh(speedLine3Geom, speedLineMat)
    speedLine3.position.set(0.0, 0.3, 0.35)
    group.add(speedLine3)

    this.mesh = group
    this.scene.add(this.mesh)
  }
}
