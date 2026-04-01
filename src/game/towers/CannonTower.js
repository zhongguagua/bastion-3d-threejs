import Tower from './Tower'
import * as THREE from 'three'
import { TOWER_STATS, TOWER } from '../core/Constants'
import Cannonball from '../projectiles/Cannonball'

export default class CannonTower extends Tower {
  constructor(scene, col, row) {
    super(scene, TOWER.TYPES.CANNON, col, row)
  }

  _buildMesh() {
    const group = new THREE.Group()
    const pos = this._getWorldPos()
    const stats = TOWER_STATS[TOWER.TYPES.CANNON]

    // Base platform
    const baseGeom = new THREE.CylinderGeometry(0.7, 0.9, 0.3, 8)
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x8b7355 })
    const base = new THREE.Mesh(baseGeom, baseMat)
    base.position.y = 0.15
    base.castShadow = true
    group.add(base)

    // Cannon body (rotating part)
    const turretGroup = new THREE.Group()
    turretGroup.position.y = 0.5

    const bodyGeom = new THREE.SphereGeometry(0.45, 8, 6)
    const bodyMat = new THREE.MeshPhongMaterial({ color: stats.color[0], flatShading: true })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.castShadow = true
    turretGroup.add(body)

    // Barrel
    const barrelGeom = new THREE.CylinderGeometry(0.12, 0.15, 0.8, 8)
    barrelGeom.rotateX(Math.PI / 2)
    const barrelMat = new THREE.MeshPhongMaterial({ color: 0x444444 })
    const barrel = new THREE.Mesh(barrelGeom, barrelMat)
    barrel.position.z = -0.5
    turretGroup.add(barrel)

    group.add(turretGroup)
    group.position.copy(pos)
    this.turretGroup = turretGroup
    this.mesh = group
    this.scene.add(this.mesh)
  }

  _lookAtTarget(target) {
    if (this.turretGroup) {
      const targetPos = target.mesh.position.clone()
      targetPos.y = this.turretGroup.parent.position.y + 0.5
      this.turretGroup.lookAt(targetPos)
    }
  }

  _fire(target) {
    const startPos = this.mesh.position.clone()
    startPos.y += 1.0
    return new Cannonball(this.scene, startPos, target, this.damage, TOWER_STATS[TOWER.TYPES.CANNON].projectileSpeed)
  }

  _updateVisual() {
    const stats = TOWER_STATS[TOWER.TYPES.CANNON]
    const color = stats.color[this.level]
    if (this.turretGroup) {
      this.turretGroup.traverse(child => {
        if (child.isMesh && child.material && child.material.color) {
          const c = child.material.color.getHex()
          if (c === stats.color[0] || c === stats.color[1] || c === stats.color[2]) {
            child.material.color.setHex(color)
          }
        }
      })
    }
  }
}
