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
    const bodyMat = new THREE.MeshStandardMaterial({
      color: this.color,
      emissive: this.emissive || 0x441111,
      roughness: 0.6,
      metalness: 0.2,
    })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.35
    body.castShadow = true
    group.add(body)

    // Head
    const headGeom = new THREE.SphereGeometry(0.2, 6, 4)
    const headMat = new THREE.MeshStandardMaterial({
      color: 0xddaa88,
      roughness: 0.7,
      metalness: 0.1,
    })
    const head = new THREE.Mesh(headGeom, headMat)
    head.position.y = 0.85
    head.castShadow = true
    group.add(head)

    // Glowing eyes
    const eyeGeom = new THREE.SphereGeometry(0.05, 6, 4)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff4444 })
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat)
    eyeL.position.set(-0.08, 0.88, -0.18)
    group.add(eyeL)

    const eyeR = new THREE.Mesh(eyeGeom, eyeMat)
    eyeR.position.set(0.08, 0.88, -0.18)
    group.add(eyeR)

    // Shield
    const shieldGeom = new THREE.BoxGeometry(0.1, 0.5, 0.4)
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x888844,
      roughness: 0.5,
      metalness: 0.3,
    })
    const shield = new THREE.Mesh(shieldGeom, shieldMat)
    shield.position.set(0.35, 0.35, 0)
    shield.castShadow = true
    group.add(shield)

    this.mesh = group
    this.scene.add(this.mesh)
  }
}
