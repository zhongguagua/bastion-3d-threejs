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
    const bodyMat = new THREE.MeshStandardMaterial({
      color: this.color,
      emissive: this.emissive || 0x440011,
      roughness: 0.5,
      metalness: 0.3,
    })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.9
    body.castShadow = true
    group.add(body)

    // Glowing chest core inside the body
    const chestCoreGeom = new THREE.IcosahedronGeometry(0.2, 0)
    const chestCoreMat = new THREE.MeshBasicMaterial({ color: 0xff4400 })
    const chestCore = new THREE.Mesh(chestCoreGeom, chestCoreMat)
    chestCore.position.set(0, 0.9, -0.6)
    chestCore.name = 'chestCore'
    group.add(chestCore)

    // Crown/horns
    const hornGeom = new THREE.ConeGeometry(0.15, 0.6, 4)
    const hornMat = new THREE.MeshStandardMaterial({
      color: 0xccaa33,
      emissive: 0x332200,
      roughness: 0.4,
      metalness: 0.6,
    })
    const hornL = new THREE.Mesh(hornGeom, hornMat)
    hornL.position.set(-0.4, 1.9, 0)
    hornL.rotation.z = 0.3
    hornL.castShadow = true
    group.add(hornL)

    const hornR = new THREE.Mesh(hornGeom, hornMat)
    hornR.position.set(0.4, 1.9, 0)
    hornR.rotation.z = -0.3
    hornR.castShadow = true
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
    const padMat = new THREE.MeshStandardMaterial({
      color: 0x663322,
      roughness: 0.6,
      metalness: 0.3,
    })
    const padL = new THREE.Mesh(padGeom, padMat)
    padL.position.set(-0.9, 1.2, 0)
    padL.castShadow = true
    group.add(padL)

    const padR = new THREE.Mesh(padGeom, padMat)
    padR.position.set(0.9, 1.2, 0)
    padR.castShadow = true
    group.add(padR)

    // Outer aura glow - larger and more dramatic
    const auraGeom = new THREE.SphereGeometry(1.5, 16, 12)
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0xff2200,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    })
    const aura = new THREE.Mesh(auraGeom, auraMat)
    aura.position.y = 0.9
    aura.name = 'outerAura'
    group.add(aura)

    // Inner aura ring that pulses
    const innerAuraGeom = new THREE.SphereGeometry(1.0, 12, 8)
    const innerAuraMat = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    })
    const innerAura = new THREE.Mesh(innerAuraGeom, innerAuraMat)
    innerAura.position.y = 0.9
    innerAura.name = 'innerAura'
    group.add(innerAura)

    this.mesh = group
    this.scene.add(this.mesh)
  }

  update(dt, path) {
    super.update(dt, path)

    // Pulse the inner aura
    if (this.mesh) {
      const time = Date.now() * 0.003
      this.mesh.traverse(child => {
        if (child.name === 'innerAura') {
          const scale = 1.0 + Math.sin(time) * 0.15
          child.scale.set(scale, scale, scale)
          child.material.opacity = 0.05 + Math.sin(time) * 0.03
        }
      })
    }
  }
}
