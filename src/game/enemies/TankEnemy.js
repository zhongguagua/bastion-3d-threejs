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
    const bodyMat = new THREE.MeshStandardMaterial({
      color: this.color,
      emissive: this.emissive || 0x221100,
      roughness: 0.7,
      metalness: 0.3,
    })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 0.55
    body.castShadow = true
    group.add(body)

    // Armor plates
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x666655,
      roughness: 0.6,
      metalness: 0.5,
    })
    const plateGeom = new THREE.BoxGeometry(1.0, 0.3, 0.8)
    const plate = new THREE.Mesh(plateGeom, plateMat)
    plate.position.y = 0.95
    plate.castShadow = true
    group.add(plate)

    // Helmet
    const helmetGeom = new THREE.SphereGeometry(0.3, 6, 4)
    const helmetMat = new THREE.MeshStandardMaterial({
      color: 0x555544,
      roughness: 0.5,
      metalness: 0.4,
    })
    const helmet = new THREE.Mesh(helmetGeom, helmetMat)
    helmet.position.y = 1.15
    helmet.castShadow = true
    group.add(helmet)

    // Visor slit - glowing red strip on front of helmet
    const visorGeom = new THREE.BoxGeometry(0.25, 0.05, 0.05)
    const visorMat = new THREE.MeshBasicMaterial({ color: 0xff3333 })
    const visor = new THREE.Mesh(visorGeom, visorMat)
    visor.position.set(0, 1.15, -0.3)
    group.add(visor)

    // Shoulder spikes - left
    const spikeGeom = new THREE.ConeGeometry(0.08, 0.3, 4)
    const spikeMat = new THREE.MeshStandardMaterial({
      color: 0x555544,
      roughness: 0.5,
      metalness: 0.4,
    })
    const spikeL = new THREE.Mesh(spikeGeom, spikeMat)
    spikeL.position.set(-0.55, 1.1, 0)
    spikeL.castShadow = true
    group.add(spikeL)

    // Shoulder spikes - right
    const spikeR = new THREE.Mesh(spikeGeom, spikeMat)
    spikeR.position.set(0.55, 1.1, 0)
    spikeR.castShadow = true
    group.add(spikeR)

    this.mesh = group
    this.scene.add(this.mesh)
  }
}
