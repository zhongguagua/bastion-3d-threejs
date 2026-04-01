import Tower from './Tower'
import * as THREE from 'three'
import { TOWER_STATS, TOWER } from '../core/Constants'
import SniperBullet from '../projectiles/SniperBullet'

export default class SniperTower extends Tower {
  constructor(scene, col, row) {
    super(scene, TOWER.TYPES.SNIPER, col, row)
  }

  _buildMesh() {
    const group = new THREE.Group()
    const pos = this._getWorldPos()
    const stats = TOWER_STATS[TOWER.TYPES.SNIPER]

    // Base
    const baseGeom = new THREE.CylinderGeometry(0.5, 0.7, 0.3, 8)
    const baseMat = new THREE.MeshPhongMaterial({ color: 0x8b7355 })
    const base = new THREE.Mesh(baseGeom, baseMat)
    base.position.y = 0.15
    base.castShadow = true
    group.add(base)

    // Pillar
    const pillarGeom = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8)
    const pillarMat = new THREE.MeshPhongMaterial({ color: 0x666666 })
    const pillar = new THREE.Mesh(pillarGeom, pillarMat)
    pillar.position.y = 1.0
    pillar.castShadow = true
    group.add(pillar)

    // Scope head
    const headGroup = new THREE.Group()
    headGroup.position.y = 1.8

    const scopeGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8)
    scopeGeom.rotateX(Math.PI / 2)
    const scopeMat = new THREE.MeshPhongMaterial({ color: stats.color[0], flatShading: true })
    const scope = new THREE.Mesh(scopeGeom, scopeMat)
    scope.position.z = -0.3
    headGroup.add(scope)

    // Lens
    const lensGeom = new THREE.SphereGeometry(0.08, 8, 6)
    const lensMat = new THREE.MeshBasicMaterial({ color: 0xff4444 })
    const lens = new THREE.Mesh(lensGeom, lensMat)
    lens.position.z = -0.6
    headGroup.add(lens)

    group.add(headGroup)
    this.headGroup = headGroup

    group.position.copy(pos)
    this.mesh = group
    this.scene.add(this.mesh)
  }

  _lookAtTarget(target) {
    if (this.headGroup) {
      const worldPos = new THREE.Vector3()
      this.headGroup.getWorldPosition(worldPos)
      const targetPos = target.mesh.position.clone()
      targetPos.y = worldPos.y
      this.headGroup.lookAt(targetPos)
    }
  }

  _fire(target) {
    const startPos = this.mesh.position.clone()
    startPos.y += 1.8
    return new SniperBullet(this.scene, startPos, target, this.damage, TOWER_STATS[TOWER.TYPES.SNIPER].projectileSpeed)
  }

  _updateVisual() {
    const stats = TOWER_STATS[TOWER.TYPES.SNIPER]
    const color = stats.color[this.level]
    if (this.headGroup) {
      this.headGroup.traverse(child => {
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
