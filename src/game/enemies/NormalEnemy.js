import Enemy from './Enemy'
import * as THREE from 'three'
import { ENEMY_STATS, ENEMY } from '../core/Constants'

export default class NormalEnemy extends Enemy {
  constructor(scene, hpMultiplier = 1) {
    const stats = ENEMY_STATS[ENEMY.TYPES.NORMAL]
    super(scene, {
      type: ENEMY.TYPES.NORMAL,
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

    // Body - simple humanoid-like shape
    const bodyGeom = new THREE.BoxGeometry(0.5, 0.7, 0.4)
    const bodyMat = new THREE.MeshPhongMaterial({ color: this.color, flatShading: true })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.35
    body.castShadow = true
    group.add(body)

    // Head
    const headGeom = new THREE.SphereGeometry(0.2, 6, 4)
    const headMat = new THREE.MeshPhongMaterial({ color: 0xddaa88, flatShading: true })
    const head = new THREE.Mesh(headGeom, headMat)
    head.position.y = 0.85
    head.castShadow = true
    group.add(head)

    // Shield
    const shieldGeom = new THREE.BoxGeometry(0.1, 0.5, 0.4)
    const shieldMat = new THREE.MeshPhongMaterial({ color: 0x888844, flatShading: true })
    const shield = new THREE.Mesh(shieldGeom, shieldMat)
    shield.position.set(0.35, 0.35, 0)
    group.add(shield)

    this.mesh = group
    this.scene.add(this.mesh)
  }
}
