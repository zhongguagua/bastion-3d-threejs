import Enemy from './Enemy'
import * as THREE from 'three'
import { ENEMY_STATS, ENEMY } from '../core/Constants'

export default class BossEnemy extends Enemy {
  constructor(scene, hpMultiplier = 1) {
    const stats = ENEMY_STATS[ENEMY.TYPES.BOSS]
    super(scene, {
      type: ENEMY.TYPES.BOSS,
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

    // Large body
    const bodyGeom = new THREE.BoxGeometry(1.4, 1.4, 1.2)
    const bodyMat = new THREE.MeshPhongMaterial({ color: this.color, flatShading: true })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.9
    body.castShadow = true
    group.add(body)

    // Crown/horns
    const hornGeom = new THREE.ConeGeometry(0.15, 0.6, 4)
    const hornMat = new THREE.MeshPhongMaterial({ color: 0xccaa33, flatShading: true })
    const hornL = new THREE.Mesh(hornGeom, hornMat)
    hornL.position.set(-0.4, 1.9, 0)
    hornL.rotation.z = 0.3
    group.add(hornL)

    const hornR = new THREE.Mesh(hornGeom, hornMat)
    hornR.position.set(0.4, 1.9, 0)
    hornR.rotation.z = -0.3
    group.add(hornR)

    // Eyes (glowing)
    const eyeGeom = new THREE.SphereGeometry(0.12, 6, 4)
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff2200 })
    const eyeL = new THREE.Mesh(eyeGeom, eyeMat)
    eyeL.position.set(-0.3, 1.2, -0.6)
    group.add(eyeL)

    const eyeR = new THREE.Mesh(eyeGeom, eyeMat)
    eyeR.position.set(0.3, 1.2, -0.6)
    group.add(eyeR)

    // Shoulder pads
    const padGeom = new THREE.BoxGeometry(0.4, 0.4, 0.4)
    const padMat = new THREE.MeshPhongMaterial({ color: 0x663322, flatShading: true })
    const padL = new THREE.Mesh(padGeom, padMat)
    padL.position.set(-0.9, 1.2, 0)
    group.add(padL)

    const padR = new THREE.Mesh(padGeom, padMat)
    padR.position.set(0.9, 1.2, 0)
    group.add(padR)

    // Aura glow
    const auraGeom = new THREE.SphereGeometry(1.2, 12, 8)
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    })
    const aura = new THREE.Mesh(auraGeom, auraMat)
    aura.position.y = 0.9
    group.add(aura)

    this.mesh = group
    this.scene.add(this.mesh)
  }
}
