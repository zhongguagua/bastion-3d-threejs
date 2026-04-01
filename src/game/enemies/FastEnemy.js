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
    const bodyMat = new THREE.MeshPhongMaterial({ color: this.color, flatShading: true })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.4
    body.castShadow = true
    group.add(body)

    // Trail effect
    const trailGeom = new THREE.ConeGeometry(0.15, 0.5, 4)
    const trailMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.5,
    })
    const trail = new THREE.Mesh(trailGeom, trailMat)
    trail.position.y = 0.15
    trail.rotation.x = Math.PI
    group.add(trail)

    this.mesh = group
    this.scene.add(this.mesh)
  }
}
