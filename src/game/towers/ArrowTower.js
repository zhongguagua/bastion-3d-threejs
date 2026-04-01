import Tower from './Tower'
import * as THREE from 'three'
import { TOWER_STATS, TOWER } from '../core/Constants'
import Arrow from '../projectiles/Arrow'

export default class ArrowTower extends Tower {
  constructor(scene, col, row) {
    super(scene, TOWER.TYPES.ARROW, col, row)
  }

  _buildMesh() {
    const group = new THREE.Group()
    const pos = this._getWorldPos()
    const stats = TOWER_STATS[TOWER.TYPES.ARROW]

    // Base - stone-colored PBR material
    const baseGeom = new THREE.CylinderGeometry(0.6, 0.8, 0.4, 8)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x8b7355,
      roughness: 0.7,
      metalness: 0.15
    })
    const base = new THREE.Mesh(baseGeom, baseMat)
    base.position.y = 0.2
    base.castShadow = true
    group.add(base)

    // Tower body - PBR with emissive
    const bodyGeom = new THREE.CylinderGeometry(0.35, 0.5, 1.2, 8)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: stats.color[0],
      emissive: stats.emissive[0],
      roughness: 0.5,
      metalness: 0.3
    })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    body.position.y = 1.0
    body.castShadow = true
    group.add(body)

    // Battlement - same material as body
    for (let i = 0; i < 4; i++) {
      const merlonGeom = new THREE.BoxGeometry(0.2, 0.3, 0.2)
      const merlon = new THREE.Mesh(merlonGeom, bodyMat)
      const angle = (i / 4) * Math.PI * 2
      merlon.position.set(Math.cos(angle) * 0.35, 1.7, Math.sin(angle) * 0.35)
      merlon.castShadow = true
      group.add(merlon)
    }

    // Glow ring at base
    const glowGeom = new THREE.TorusGeometry(0.7, 0.05, 8, 32)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00ff44,
      transparent: true,
      opacity: 0.6
    })
    const glowRing = new THREE.Mesh(glowGeom, glowMat)
    glowRing.rotation.x = -Math.PI / 2
    glowRing.position.y = 0.05
    group.add(glowRing)

    group.position.copy(pos)
    this.mesh = group
    this.scene.add(this.mesh)
  }

  _fire(target) {
    const startPos = this.mesh.position.clone()
    startPos.y += 1.5
    return new Arrow(this.scene, startPos, target, this.damage, TOWER_STATS[TOWER.TYPES.ARROW].projectileSpeed)
  }

  _updateVisual() {
    const stats = TOWER_STATS[TOWER.TYPES.ARROW]
    const color = stats.color[this.level]
    this.mesh.traverse(child => {
      if (child.isMesh && child.material && child.material.color) {
        const c = child.material.color.getHex()
        if (c === stats.color[0] || c === stats.color[1] || c === stats.color[2]) {
          child.material.color.setHex(color)
          child.material.emissive.setHex(stats.emissive[this.level])
        }
      }
    })
  }
}
