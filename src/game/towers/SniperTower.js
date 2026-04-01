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

    // Base - stone PBR material
    const baseGeom = new THREE.CylinderGeometry(0.5, 0.7, 0.3, 8)
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

    // Pillar - dark metal PBR material
    const pillarGeom = new THREE.CylinderGeometry(0.15, 0.2, 1.5, 8)
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x333338,
      roughness: 0.3,
      metalness: 0.8,
    })
    const pillar = new THREE.Mesh(pillarGeom, pillarMat)
    pillar.position.y = 1.0
    pillar.castShadow = true
    pillar.receiveShadow = true
    group.add(pillar)

    // Base glow ring - purple transparent torus
    const glowRingGeom = new THREE.TorusGeometry(0.6, 0.04, 8, 32)
    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0xaa44aa,
      transparent: true,
      opacity: 0.5,
    })
    const glowRing = new THREE.Mesh(glowRingGeom, glowRingMat)
    glowRing.rotation.x = -Math.PI / 2
    glowRing.position.y = 0.31
    group.add(glowRing)

    // Scope head
    const headGroup = new THREE.Group()
    headGroup.position.y = 1.8

    // Scope body - PBR with tower color and emissive
    const scopeGeom = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8)
    scopeGeom.rotateX(Math.PI / 2)
    const scopeMat = new THREE.MeshStandardMaterial({
      color: stats.color[0],
      emissive: stats.emissive[0],
      roughness: 0.4,
      metalness: 0.5,
      flatShading: true,
    })
    const scope = new THREE.Mesh(scopeGeom, scopeMat)
    scope.position.z = -0.3
    scope.castShadow = true
    headGroup.add(scope)

    // Lens - red emissive glow
    const lensGeom = new THREE.SphereGeometry(0.08, 8, 6)
    const lensMat = new THREE.MeshStandardMaterial({
      color: 0xff4444,
      emissive: 0xff2222,
      emissiveIntensity: 1.0,
      roughness: 0.3,
      metalness: 0.2,
    })
    const lens = new THREE.Mesh(lensGeom, lensMat)
    lens.position.z = -0.6
    lens.castShadow = true
    headGroup.add(lens)

    // Scope ring detail around the lens
    const scopeRingGeom = new THREE.TorusGeometry(0.1, 0.02, 8, 16)
    const scopeRingMat = new THREE.MeshStandardMaterial({
      color: 0x333338,
      roughness: 0.3,
      metalness: 0.8,
    })
    const scopeRing = new THREE.Mesh(scopeRingGeom, scopeRingMat)
    scopeRing.position.z = -0.6
    scopeRing.castShadow = true
    headGroup.add(scopeRing)

    group.add(headGroup)
    this.headGroup = headGroup
    this.glowRing = glowRing
    this.scopeMat = scopeMat
    this.lensMat = lensMat

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
    const emissive = stats.emissive[this.level]

    // Update scope material color and emissive
    if (this.scopeMat) {
      this.scopeMat.color.setHex(color)
      this.scopeMat.emissive.setHex(emissive)
    }

    // Update base glow ring to match tower color
    if (this.glowRing) {
      this.glowRing.material.color.setHex(color)
    }

    // Update lens emissive stays red glow
    if (this.lensMat) {
      this.lensMat.emissive.setHex(0xff2222)
    }

    // Fallback: traverse headGroup for any remaining color matches
    if (this.headGroup) {
      this.headGroup.traverse(child => {
        if (child.isMesh && child.material && child.material.color) {
          const c = child.material.color.getHex()
          if (c === stats.color[0] || c === stats.color[1] || c === stats.color[2]) {
            child.material.color.setHex(color)
          }
          if (child.material.emissive) {
            const e = child.material.emissive.getHex()
            if (e === stats.emissive[0] || e === stats.emissive[1] || e === stats.emissive[2]) {
              child.material.emissive.setHex(emissive)
            }
          }
        }
      })
    }
  }
}
