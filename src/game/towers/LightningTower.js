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

    // Base
    const baseGeom = new THREE.CylinderGeometry(0.6, 0.8, 0.3, 8)
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x8b7355 })
    const base = new THREE.Mesh(baseGeom, baseMat)
    base.position.y = 0.15
    base.castShadow = true
    group.add(base)

    // Coil body
    const coilGeom = new THREE.TorusKnotGeometry(0.3, 0.1, 32, 8, 2, 3)
    const coilMat = new THREE.MeshPhongMaterial({
      color: stats.color[0],
      emissive: 0x333300,
      shininess: 80,
    })
    const coil = new THREE.Mesh(coilGeom, coilMat)
    coil.position.y = 1.0
    coil.castShadow = true
    group.add(coil)
    this.coil = coil

    // Top orb
    const orbGeom = new THREE.SphereGeometry(0.2, 8, 6)
    const orbMat = new THREE.MeshBasicMaterial({
      color: 0xffff44,
      transparent: true,
      opacity: 0.8,
    })
    const orb = new THREE.Mesh(orbGeom, orbMat)
    orb.position.y = 1.5
    group.add(orb)
    this.topOrb = orb

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
    }
    return super.update(dt, enemies)
  }

  _fire(target) {
    // Lightning tower uses instant hit, so we create a special projectile
    const startPos = this.mesh.position.clone()
    startPos.y += 1.5
    // Return a simple projectile that immediately hits
    const Lightning = require('../projectiles/Lightning').default
    return new Lightning(this.scene, startPos, target, this.damage, 100)
  }

  _updateVisual() {
    const stats = TOWER_STATS[TOWER.TYPES.LIGHTNING]
    const color = stats.color[this.level]
    if (this.coil) {
      this.coil.material.color.setHex(color)
    }
  }
}
