// ==========================================
// Tower Defense Game - Game Map
// ==========================================

import * as THREE from 'three'
import { GRID, COLOR, MAP_PATH, TOWER_STATS } from '../core/Constants'
import Grid from './Grid'
import Path from './Path'

export default class GameMap {
  constructor(scene) {
    this.scene = scene
    this.grid = new Grid(GRID.COLS, GRID.ROWS, GRID.CELL_SIZE)
    this.path = new Path()
    this.mapGroup = new THREE.Group()
    this.highlightMesh = null
    this.rangeCircle = null
    this.time = 0

    this._buildTerrain()
    this._buildPath()
    this._buildGridOverlay()
    this._buildMarkers()
    this._buildHighlight()
    this._buildRangeCircle()

    this.scene.add(this.mapGroup)
  }

  _createCheckerboardTexture(size, cols, rows, color1, color2) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    const cellW = size / cols
    const cellH = size / rows

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isEven = (r + c) % 2 === 0
        ctx.fillStyle = isEven ? color1 : color2
        ctx.fillRect(c * cellW, r * cellH, cellW, cellH)
      }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    return texture
  }

  _buildTerrain() {
    const totalW = GRID.COLS * GRID.CELL_SIZE
    const totalH = GRID.ROWS * GRID.CELL_SIZE

    // Procedural checkerboard grass texture
    const tex = this._createCheckerboardTexture(512, 20, 14, '#2a4a28', '#244222')
    tex.repeat.set(1, 1)

    const groundGeom = new THREE.PlaneGeometry(totalW, totalH, 20, 14)
    groundGeom.rotateX(-Math.PI / 2)

    // Add subtle vertex displacement for organic terrain feel
    const posAttr = groundGeom.attributes.position
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i)
      if (Math.abs(y) < 0.01) {
        // Only displace non-edge vertices slightly
        posAttr.setY(i, (Math.random() - 0.5) * 0.04)
      }
    }
    groundGeom.computeVertexNormals()

    const groundMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.9,
      metalness: 0.0,
    })
    const ground = new THREE.Mesh(groundGeom, groundMat)
    ground.position.set(totalW / 2, 0, totalH / 2)
    ground.receiveShadow = true
    this.mapGroup.add(ground)

    // Raised edge border with stone texture
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0x3a2a1a,
      roughness: 0.85,
      metalness: 0.1,
    })

    // North edge
    const nEdge = new THREE.Mesh(
      new THREE.BoxGeometry(totalW + 3, 0.4, 1.5),
      edgeMat
    )
    nEdge.position.set(totalW / 2, 0.2, totalH + 0.75)
    nEdge.receiveShadow = true
    this.mapGroup.add(nEdge)

    // South edge
    const sEdge = new THREE.Mesh(
      new THREE.BoxGeometry(totalW + 3, 0.4, 1.5),
      edgeMat
    )
    sEdge.position.set(totalW / 2, 0.2, -0.75)
    sEdge.receiveShadow = true
    this.mapGroup.add(sEdge)

    // East edge
    const eEdge = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.4, totalH + 3),
      edgeMat
    )
    eEdge.position.set(totalW + 0.75, 0.2, totalH / 2)
    eEdge.receiveShadow = true
    this.mapGroup.add(eEdge)

    // West edge
    const wEdge = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.4, totalH + 3),
      edgeMat
    )
    wEdge.position.set(-0.75, 0.2, totalH / 2)
    wEdge.receiveShadow = true
    this.mapGroup.add(wEdge)

    // Corner posts
    const postGeom = new THREE.CylinderGeometry(0.3, 0.35, 0.8, 8)
    const postMat = new THREE.MeshStandardMaterial({
      color: 0x4a3a2a,
      roughness: 0.7,
      metalness: 0.15,
    })
    const corners = [
      [-0.75, totalH + 0.75],
      [totalW + 0.75, totalH + 0.75],
      [-0.75, -0.75],
      [totalW + 0.75, -0.75],
    ]
    corners.forEach(([x, z]) => {
      const post = new THREE.Mesh(postGeom, postMat)
      post.position.set(x, 0.4, z)
      post.castShadow = true
      this.mapGroup.add(post)
    })
  }

  _buildPath() {
    const waypoints = MAP_PATH
    this.grid.markPath(waypoints)

    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i]
      const to = waypoints[i + 1]
      this._buildPathSegment(from, to)
    }
  }

  _buildPathSegment(from, to) {
    const dx = to.x - from.x
    const dz = to.z - from.z
    const length = (Math.abs(dx) + Math.abs(dz)) * GRID.CELL_SIZE
    const isHorizontal = Math.abs(dx) > 0

    const centerX = (from.x + to.x) / 2 * GRID.CELL_SIZE + GRID.CELL_SIZE / 2
    const centerZ = (from.z + to.z) / 2 * GRID.CELL_SIZE + GRID.CELL_SIZE / 2

    // Path body - slightly raised dirt road
    const pathW = isHorizontal ? length : GRID.CELL_SIZE * 0.95
    const pathD = isHorizontal ? GRID.CELL_SIZE * 0.95 : length

    const pathGeom = new THREE.BoxGeometry(pathW, 0.08, pathD)
    const pathMat = new THREE.MeshStandardMaterial({
      color: COLOR.PATH,
      roughness: 0.95,
      metalness: 0.0,
    })
    const pathMesh = new THREE.Mesh(pathGeom, pathMat)
    pathMesh.position.set(centerX, 0.04, centerZ)
    pathMesh.receiveShadow = true
    this.mapGroup.add(pathMesh)

    // Center line - lighter dirt
    const clW = isHorizontal ? length : GRID.CELL_SIZE * 0.5
    const clD = isHorizontal ? GRID.CELL_SIZE * 0.5 : length
    const clGeom = new THREE.BoxGeometry(clW, 0.09, clD)
    const clMat = new THREE.MeshStandardMaterial({
      color: COLOR.PATH_CENTER,
      roughness: 0.9,
      metalness: 0.0,
    })
    const clMesh = new THREE.Mesh(clGeom, clMat)
    clMesh.position.set(centerX, 0.045, centerZ)
    clMesh.receiveShadow = true
    this.mapGroup.add(clMesh)

    // Stone edges along the path
    const edgeW = 0.12
    const edgeColor = COLOR.PATH_EDGE

    if (isHorizontal) {
      // North stone edge
      const neGeom = new THREE.BoxGeometry(length, 0.12, edgeW)
      const neMat = new THREE.MeshStandardMaterial({
        color: edgeColor,
        roughness: 0.8,
        metalness: 0.05,
      })
      const ne = new THREE.Mesh(neGeom, neMat)
      ne.position.set(centerX, 0.06, centerZ + GRID.CELL_SIZE * 0.48)
      ne.receiveShadow = true
      this.mapGroup.add(ne)

      // South stone edge
      const se = ne.clone()
      se.position.z = centerZ - GRID.CELL_SIZE * 0.48
      this.mapGroup.add(se)
    } else {
      // East stone edge
      const eeGeom = new THREE.BoxGeometry(edgeW, 0.12, length)
      const eeMat = new THREE.MeshStandardMaterial({
        color: edgeColor,
        roughness: 0.8,
        metalness: 0.05,
      })
      const ee = new THREE.Mesh(eeGeom, eeMat)
      ee.position.set(centerX + GRID.CELL_SIZE * 0.48, 0.06, centerZ)
      ee.receiveShadow = true
      this.mapGroup.add(ee)

      // West stone edge
      const we = ee.clone()
      we.position.x = centerX - GRID.CELL_SIZE * 0.48
      this.mapGroup.add(we)
    }
  }

  _buildGridOverlay() {
    const material = new THREE.LineBasicMaterial({
      color: COLOR.GRID_LINE,
      transparent: true,
      opacity: 0.2,
    })

    const totalWidth = GRID.COLS * GRID.CELL_SIZE
    const totalHeight = GRID.ROWS * GRID.CELL_SIZE

    for (let col = 0; col <= GRID.COLS; col++) {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(col * GRID.CELL_SIZE, 0.02, 0),
        new THREE.Vector3(col * GRID.CELL_SIZE, 0.02, totalHeight),
      ])
      this.mapGroup.add(new THREE.Line(geom, material))
    }

    for (let row = 0; row <= GRID.ROWS; row++) {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.02, row * GRID.CELL_SIZE),
        new THREE.Vector3(totalWidth, 0.02, row * GRID.CELL_SIZE),
      ])
      this.mapGroup.add(new THREE.Line(geom, material))
    }
  }

  _buildMarkers() {
    // Spawn point - glowing portal
    const spawnPos = this.grid.getWorldPosition(
      Math.max(0, MAP_PATH[0].x),
      MAP_PATH[0].z
    )
    const spawnX = MAP_PATH[0].x < 0 ? -GRID.CELL_SIZE / 2 : spawnPos.x
    const spawnZ = spawnPos.z

    // Spawn base ring
    const spawnRingGeom = new THREE.TorusGeometry(0.8, 0.12, 8, 24)
    spawnRingGeom.rotateX(Math.PI / 2)
    const spawnRingMat = new THREE.MeshStandardMaterial({
      color: COLOR.SPAWN,
      emissive: COLOR.SPAWN_EMISSIVE,
      emissiveIntensity: 1.5,
      roughness: 0.4,
      metalness: 0.6,
    })
    const spawnRing = new THREE.Mesh(spawnRingGeom, spawnRingMat)
    spawnRing.position.set(spawnX, 0.2, spawnZ)
    spawnRing.castShadow = true
    this.mapGroup.add(spawnRing)
    this.spawnRing = spawnRing

    // Spawn inner glow orb
    const spawnOrbGeom = new THREE.SphereGeometry(0.3, 12, 8)
    const spawnOrbMat = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      transparent: true,
      opacity: 0.6,
    })
    const spawnOrb = new THREE.Mesh(spawnOrbGeom, spawnOrbMat)
    spawnOrb.position.set(spawnX, 0.5, spawnZ)
    this.mapGroup.add(spawnOrb)
    this.spawnOrb = spawnOrb

    // Spawn pillar
    const spawnPillarGeom = new THREE.CylinderGeometry(0.08, 0.08, 1.8, 6)
    const spawnPillarMat = new THREE.MeshStandardMaterial({
      color: 0x553333,
      roughness: 0.6,
      metalness: 0.3,
    })
    const spawnPillar = new THREE.Mesh(spawnPillarGeom, spawnPillarMat)
    spawnPillar.position.set(spawnX, 0.9, spawnZ)
    spawnPillar.castShadow = true
    this.mapGroup.add(spawnPillar)

    // Base (castle) marker
    const lastWP = MAP_PATH[MAP_PATH.length - 1]
    const basePos = this.grid.getWorldPosition(
      Math.min(GRID.COLS - 1, lastWP.x),
      lastWP.z
    )
    const baseX = lastWP.x >= GRID.COLS ? GRID.COLS * GRID.CELL_SIZE + GRID.CELL_SIZE / 2 : basePos.x
    const baseZ = basePos.z

    // Castle keep
    const keepGeom = new THREE.BoxGeometry(GRID.CELL_SIZE * 1.1, 1.8, GRID.CELL_SIZE * 1.1)
    const keepMat = new THREE.MeshStandardMaterial({
      color: COLOR.BASE,
      emissive: COLOR.BASE_EMISSIVE,
      emissiveIntensity: 0.8,
      roughness: 0.5,
      metalness: 0.4,
    })
    const keep = new THREE.Mesh(keepGeom, keepMat)
    keep.position.set(baseX, 0.9, baseZ)
    keep.castShadow = true
    this.mapGroup.add(keep)

    // Castle battlements
    for (let i = 0; i < 4; i++) {
      const mGeom = new THREE.BoxGeometry(0.3, 0.4, 0.3)
      const m = new THREE.Mesh(mGeom, keepMat)
      const angle = (i / 4) * Math.PI * 2
      const r = GRID.CELL_SIZE * 0.55
      m.position.set(
        baseX + Math.cos(angle) * r,
        2.0,
        baseZ + Math.sin(angle) * r
      )
      m.castShadow = true
      this.mapGroup.add(m)
    }

    // Castle base glow ring
    const baseRingGeom = new THREE.TorusGeometry(1.2, 0.08, 8, 24)
    baseRingGeom.rotateX(Math.PI / 2)
    const baseRingMat = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.4,
    })
    const baseRing = new THREE.Mesh(baseRingGeom, baseRingMat)
    baseRing.position.set(baseX, 0.1, baseZ)
    this.mapGroup.add(baseRing)
    this.baseRing = baseRing

    // Flag pole
    const poleGeom = new THREE.CylinderGeometry(0.04, 0.04, 2.5, 6)
    const poleMat = new THREE.MeshStandardMaterial({
      color: 0xaaaacc,
      roughness: 0.4,
      metalness: 0.7,
    })
    const pole = new THREE.Mesh(poleGeom, poleMat)
    pole.position.set(baseX, 1.25, baseZ)
    pole.castShadow = true
    this.mapGroup.add(pole)

    // Flag cloth
    const flagGeom = new THREE.PlaneGeometry(0.8, 0.5)
    const flagMat = new THREE.MeshStandardMaterial({
      color: 0x4488ff,
      emissive: 0x112244,
      emissiveIntensity: 0.5,
      roughness: 0.7,
      metalness: 0.2,
      side: THREE.DoubleSide,
    })
    const flag = new THREE.Mesh(flagGeom, flagMat)
    flag.position.set(baseX + 0.4, 2.3, baseZ)
    this.mapGroup.add(flag)
    this.flag = flag
  }

  _buildHighlight() {
    const geom = new THREE.PlaneGeometry(GRID.CELL_SIZE, GRID.CELL_SIZE)
    geom.rotateX(-Math.PI / 2)
    const mat = new THREE.MeshBasicMaterial({
      color: COLOR.GRID_HIGHLIGHT,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    this.highlightMesh = new THREE.Mesh(geom, mat)
    this.highlightMesh.visible = false
    this.highlightMesh.position.y = 0.05
    this.mapGroup.add(this.highlightMesh)
  }

  _buildRangeCircle() {
    const geom = new THREE.RingGeometry(4.9, 5, 48)
    geom.rotateX(-Math.PI / 2)
    const mat = new THREE.MeshBasicMaterial({
      color: COLOR.RANGE_CIRCLE,
      transparent: true,
      opacity: 0.2,
      side: THREE.DoubleSide,
      depthWrite: false,
    })
    this.rangeCircle = new THREE.Mesh(geom, mat)
    this.rangeCircle.visible = false
    this.rangeCircle.position.y = 0.08
    this.mapGroup.add(this.rangeCircle)
  }

  highlightCell(col, row) {
    if (col < 0 || col >= GRID.COLS || row < 0 || row >= GRID.ROWS) {
      this.highlightMesh.visible = false
      return
    }

    const pos = this.grid.getWorldPosition(col, row)
    this.highlightMesh.position.x = pos.x
    this.highlightMesh.position.z = pos.z
    this.highlightMesh.visible = true

    const canBuild = this.grid.canBuild(col, row)
    this.highlightMesh.material.color.setHex(canBuild ? COLOR.GRID_HIGHLIGHT : COLOR.RANGE_CIRCLE_INVALID)
  }

  showPlacementRange(towerType) {
    const stats = TOWER_STATS[towerType]
    if (!stats) return
    const range = stats.range[0]
    this._updateRangeCircle(range, null)
  }

  showTowerRange(tower) {
    if (!tower) return
    const stats = TOWER_STATS[tower.type]
    const range = stats.range[tower.level]
    this._updateRangeCircle(range, tower)
  }

  _updateRangeCircle(range, tower) {
    const innerRadius = Math.max(0.01, range - 0.15)
    this.rangeCircle.geometry.dispose()
    this.rangeCircle.geometry = new THREE.RingGeometry(innerRadius, range, 48)
    this.rangeCircle.geometry.rotateX(-Math.PI / 2)

    if (tower) {
      this.rangeCircle.position.x = tower.mesh.position.x
      this.rangeCircle.position.z = tower.mesh.position.z
    }
    this.rangeCircle.visible = true
  }

  hideRangeCircle() {
    if (this.rangeCircle) {
      this.rangeCircle.visible = false
    }
    if (this.highlightMesh) {
      this.highlightMesh.visible = false
    }
  }

  canBuild(col, row) {
    return this.grid.canBuild(col, row)
  }

  placeTower(col, row, tower) {
    this.grid.placeTower(col, row, tower)
  }

  removeTower(col, row) {
    this.grid.removeTower(col, row)
  }

  getTowerAt(col, row) {
    return this.grid.getTowerAt(col, row)
  }

  update(dt) {
    this.time += dt

    // Animate spawn portal
    if (this.spawnRing) {
      this.spawnRing.rotation.z += dt * 1.5
    }
    if (this.spawnOrb) {
      this.spawnOrb.position.y = 0.5 + Math.sin(this.time * 3) * 0.15
      this.spawnOrb.material.opacity = 0.4 + Math.sin(this.time * 4) * 0.2
    }

    // Animate base ring
    if (this.baseRing) {
      this.baseRing.material.opacity = 0.25 + Math.sin(this.time * 2) * 0.15
    }

    // Animate flag
    if (this.flag) {
      this.flag.rotation.y = Math.sin(this.time * 2) * 0.1
    }
  }

  reset() {
    this.grid.reset()
    this.grid.markPath(MAP_PATH)
  }
}
