import Enemy from './Enemy'
import * as THREE from 'three'
import { ENEMY_STATS, ENEMY } from '../core/Constants'

export default class TankEnemy extends Enemy {
  constructor(scene, hpMultiplier = 1) {
    const stats = ENEMY_STATS[ENEMY.TYPES.TANK]
    super(scene, {
      type: ENEMY.TYPES.TANK,
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

    // Heavy body
    const bodyGeom = new THREE.BoxGeometry(0.9, 0.7, 0.7)
    const bodyMat = new THREE.MeshPhongMaterial({ color: this.color, flatShading: true })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.55
    body.castShadow = true
    group.add(body)

    // Armor plates
    const plateMat = new THREE.MeshPhongMaterial({ color: 0x666655, flatShading: true })
    const plateGeom = new THREE.BoxGeometry(1.0, 0.3, 0.8)
    const plate = new THREE.Mesh(plateGeom, plateMat)
    plate.position.y = 0.95
    group.add(plate)

    // Helmet
    const helmetGeom = new THREE.SphereGeometry(0.3, 6, 4)
    const helmetMat = new THREE.MeshPhongMaterial({ color: 0x555544, flatShading: true })
    const helmet = new THREE.Mesh(helmetGeom, helmetMat)
    helmet.position.y = 1.15
    helmet.castShadow = true
    group.add(helmet)

    this.mesh = group
    this.scene.add(this.mesh)
  }
}
