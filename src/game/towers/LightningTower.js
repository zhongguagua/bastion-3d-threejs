import Tower from './Tower'
import * as THREE from 'three'
import { TOWER_STATS, TOWER } from '../core/Constants'

export default class LightningTower extends Tower {
  constructor(scene, col, row) {
    super(scene, TOWER.TYPES.LIGHTNING, col, row)
  }

  _buildMesh() {
    const group = new THREE.Group()
    const pos = this._getWorldPos()
    const stats = TOWER_STATS[TOWER.TYPES.LIGHTNING]

    // Base - stone pedestal with PBR material
    const baseGeom = new THREE.CylinderGeometry(0.6, 0.8, 0.3, 8)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x555550,
      roughness: 0.7,
      metalness: 0.15,
    })
    const base = new THREE.Mesh(baseGeom, baseMat)
    base.position.y = 0.15
    base.castShadow = true
    base.receiveShadow = true
    group.add(base)

    // Coil body - PBR metallic coil
    const coilGeom = new THREE.TorusKnotGeometry(0.3, 0.1, 32, 8, 2, 3)
    const coilMat = new THREE.MeshStandardMaterial({
      color: stats.color[0],
      emissive: stats.emissive[0],
      roughness: 0.3,
      metalness: 0.7,
    })
    const coil = new THREE.Mesh(coilGeom, coilMat)
    coil.position.y = 1.0
    coil.castShadow = true
    group.add(coil)
    this.coil = coil

    // Top orb - PBR glowing sphere
    const orbGeom = new THREE.SphereGeometry(0.2, 16, 12)
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xffff44,
      emissive: stats.emissive[0],
      emissiveIntensity: 2.0,
      transparent: true,
      opacity: 0.8,
      roughness: 0.2,
      metalness: 0.5,
    })
    const orb = new THREE.Mesh(orbGeom, orbMat)
    orb.position.y = 1.5
    orb.castShadow = true
    group.add(orb)
    this.topOrb = orb

    // Base glow ring - yellow transparent torus at the base
    const glowRingGeom = new THREE.TorusGeometry(0.7, 0.05, 8, 32)
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0xffff44,
      transparent: true,
      opacity: 0.4,
    })
    const glowRing = new THREE.Mesh(glowRingGeom, glowRingMat)
    glowRing.rotation.x = -Math.PI / 2
    glowRing.position.y = 0.31
    group.add(glowRing)
    this.glowRing = glowRing

    // Antenna rods - 3 thin cylinders sticking up from the coil
    const antennaMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      roughness: 0.3,
      metalness: 0.8,
    })

    const antennaPositions = [
      { x: 0.0, z: 0.0 },
      { x: 0.15, z: 0.15 },
      { x: -0.15, z: 0.15 },
    ]

    this.antennas = []
    antennaPositions.forEach((ap) => {
      const antennaGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6)
      const antenna = new THREE.Mesh(antennaGeom, antennaMat)
      antenna.position.set(ap.x, 1.45, ap.z)
      antenna.castShadow = true
      group.add(antenna)
      this.antennas.push(antenna)
    })

    group.position.copy(pos)
    this.mesh = group
    this.scene.add(this.mesh)
  }

  update(dt, enemies) {
    if (this.coil) {
      this.coil.rotation.y += dt * 3
    }
    if (this.topOrb) {
      this.topOrb.material.opacity = 0.5 + Math.sin(Date.now() * 0.005) * 0.3
      this.topOrb.material.emissiveIntensity = 1.5 + Math.sin(Date.now() * 0.004) * 0.5
    }
    if (this.glowRing) {
      this.glowRing.material.opacity = 0.25 + Math.sin(Date.now() * 0.003) * 0.15
    }
    return super.update(dt, enemies)
  }

  _fire(target) {
    const startPos = this.mesh.position.clone()
    startPos.y += 1.5
    const Lightning = require('../projectiles/Lightning').default
    return new Lightning(this.scene, startPos, target, this.damage, 100)
  }

  _updateVisual() {
    const stats = TOWER_STATS[TOWER.TYPES.LIGHTNING]
    const color = stats.color[this.level]
    const emissive = stats.emissive[this.level]
    if (this.coil) {
      this.coil.material.color.setHex(color)
      this.coil.material.emissive.setHex(emissive)
    }
    if (this.topOrb) {
      this.topOrb.material.emissive.setHex(emissive)
    }
    if (this.glowRing) {
      this.glowRing.material.color.setHex(color)
    }
  }
}
