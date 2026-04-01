import Tower from './Tower'
import * as THREE from 'three'
import { TOWER_STATS, TOWER } from '../core/Constants'
import IceShard from '../projectiles/IceShard'

export default class IceTower extends Tower {
  constructor(scene, col, row) {
    super(scene, TOWER.TYPES.ICE, col, row)
  }

  _buildMesh() {
    const group = new THREE.Group()
    const pos = this._getWorldPos()
    const stats = TOWER_STATS[TOWER.TYPES.ICE]

    // Base
    const baseGeom = new THREE.CylinderGeometry(0.6, 0.8, 0.3, 6)
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x8b7355 })
    const base = new THREE.Mesh(baseGeom, baseMat)
    base.position.y = 0.15
    base.castShadow = true
    group.add(base)

    // Crystal body
    const crystalGeom = new THREE.OctahedronGeometry(0.5, 0)
    const crystalMat = new THREE.MeshPhongMaterial({
      color: stats.color[0],
      transparent: true,
      opacity: 0.85,
      shininess: 100,
    })
    const crystal = new THREE.Mesh(crystalGeom, crystalMat)
    crystal.position.y = 1.0
    crystal.castShadow = true
    group.add(crystal)
    this.crystal = crystal

    // Glow ring
    const ringGeom = new THREE.TorusGeometry(0.7, 0.05, 8, 16)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x66ddff,
      transparent: true,
      opacity: 0.4,
    })
    const ring = new THREE.Mesh(ringGeom, ringMat)
    ring.position.y = 0.4
    ring.rotation.x = Math.PI / 2
    group.add(ring)

    group.position.copy(pos)
    this.mesh = group
    this.scene.add(this.mesh)
  }

  update(dt, enemies) {
    // Rotate crystal
    if (this.crystal) {
      this.crystal.rotation.y += dt * 2
    }
    return super.update(dt, enemies)
  }

  _fire(target) {
    const startPos = this.mesh.position.clone()
    startPos.y += 1.0
    return new IceShard(this.scene, startPos, target, this.damage, TOWER_STATS[TOWER.TYPES.ICE].projectileSpeed)
  }

  _updateVisual() {
    const stats = TOWER_STATS[TOWER.TYPES.ICE]
    const color = stats.color[this.level]
    if (this.crystal) {
      this.crystal.material.color.setHex(color)
    }
  }
}
