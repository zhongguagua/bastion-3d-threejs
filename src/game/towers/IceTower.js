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

    // Base — PBR stone material
    const baseGeom = new THREE.CylinderGeometry(0.6, 0.8, 0.3, 6)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x555550,
      roughness: 0.7,
      metalness: 0.15,
    })
    const base = new THREE.Mesh(baseGeom, baseMat)
    base.position.y = 0.15
    base.castShadow = true
    group.add(base)

    // Crystal body — PBR ice material
    const crystalGeom = new THREE.OctahedronGeometry(0.5, 0)
    const crystalMat = new THREE.MeshStandardMaterial({
      color: stats.color[0],
      emissive: stats.emissive[0],
      roughness: 0.1,
      metalness: 0.3,
      transparent: true,
      opacity: 0.85,
    })
    const crystal = new THREE.Mesh(crystalGeom, crystalMat)
    crystal.position.y = 1.0
    crystal.castShadow = true
    group.add(crystal)
    this.crystal = crystal

    // Glow ring — cyan transparent torus
    const ringGeom = new THREE.TorusGeometry(0.7, 0.05, 8, 16)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x66ddff,
      transparent: true,
      opacity: 0.4,
    })
    const ring = new THREE.Mesh(ringGeom, ringMat)
    ring.position.y = 0.4
    ring.rotation.x = Math.PI / 2
    ring.castShadow = true
    group.add(ring)

    // Floating ice shards orbiting the crystal
    this.iceShards = []
    const shardCount = 3
    for (let i = 0; i < shardCount; i++) {
      const shardGeom = new THREE.OctahedronGeometry(0.12, 0)
      const shardMat = new THREE.MeshStandardMaterial({
        color: stats.color[0],
        emissive: stats.emissive[0],
        roughness: 0.1,
        metalness: 0.3,
        transparent: true,
        opacity: 0.75,
      })
      const shard = new THREE.Mesh(shardGeom, shardMat)
      shard.castShadow = true

      // Distribute evenly around the crystal
      const angle = (Math.PI * 2 / shardCount) * i
      const radius = 0.7
      shard.position.y = 1.0
      shard.userData.orbitAngle = angle
      shard.userData.orbitRadius = radius
      shard.userData.orbitSpeed = 1.5
      shard.position.x = Math.cos(angle) * radius
      shard.position.z = Math.sin(angle) * radius

      group.add(shard)
      this.iceShards.push(shard)
    }

    group.position.copy(pos)
    this.mesh = group
    this.scene.add(this.mesh)
  }

  update(dt, enemies) {
    // Rotate crystal
    if (this.crystal) {
      this.crystal.rotation.y += dt * 2
    }

    // Rotate floating ice shards around the crystal
    if (this.iceShards) {
      for (const shard of this.iceShards) {
        shard.userData.orbitAngle += dt * shard.userData.orbitSpeed
        const angle = shard.userData.orbitAngle
        const radius = shard.userData.orbitRadius
        shard.position.x = Math.cos(angle) * radius
        shard.position.z = Math.sin(angle) * radius
        shard.rotation.y += dt * 3
        shard.rotation.x += dt * 2
      }
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
    const emissive = stats.emissive[this.level]
    if (this.crystal) {
      this.crystal.material.color.setHex(color)
      this.crystal.material.emissive.setHex(emissive)
    }
    // Update shard visuals to match current level
    if (this.iceShards) {
      for (const shard of this.iceShards) {
        shard.material.color.setHex(color)
        shard.material.emissive.setHex(emissive)
      }
    }
  }
}
