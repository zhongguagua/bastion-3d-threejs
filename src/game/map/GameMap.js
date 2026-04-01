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

    this._buildTerrain()
    this._buildPath()
    this._buildGridOverlay()
    this._buildMarkers()
    this._buildHighlight()
    this._buildRangeCircle()

    this.scene.add(this.mapGroup)
  }

  _buildTerrain() {
    // Ground plane
    const groundGeom = new THREE.PlaneGeometry(
      GRID.COLS * GRID.CELL_SIZE,
      GRID.ROWS * GRID.CELL_SIZE
    )
    groundGeom.rotateX(-Math.PI / 2)
    const groundMat = new THREE.MeshPhongMaterial({
      color: COLOR.GROUND,
      flatShading: true,
    })
    const ground = new THREE.Mesh(groundGeom, groundMat)
    ground.position.set(
      GRID.COLS * GRID.CELL_SIZE / 2,
      0,
      GRID.ROWS * GRID.CELL_SIZE / 2
    )
    ground.receiveShadow = true
    this.mapGroup.add(ground)

    // Decorative edges
    const edgeGeom = new THREE.BoxGeometry(
      GRID.COLS * GRID.CELL_SIZE + 2,
      0.3,
      GRID.ROWS * GRID.CELL_SIZE + 2
    )
    const edgeMat = new THREE.MeshPhongMaterial({ color: 0x3a2a1a })
    const edge = new THREE.Mesh(edgeGeom, edgeMat)
    edge.position.set(
      GRID.COLS * GRID.CELL_SIZE / 2,
      -0.15,
      GRID.ROWS * GRID.CELL_SIZE / 2
    )
    this.mapGroup.add(edge)
  }

  _buildPath() {
    const waypoints = MAP_PATH
    // Mark path cells on grid
    this.grid.markPath(waypoints)

    // Build path mesh along segments
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

    const pathGeom = new THREE.BoxGeometry(
      isHorizontal ? length : GRID.CELL_SIZE * 0.9,
      0.1,
      isHorizontal ? GRID.CELL_SIZE * 0.9 : length
    )
    const pathMat = new THREE.MeshPhongMaterial({
      color: COLOR.PATH,
      flatShading: true,
    })
    const pathMesh = new THREE.Mesh(pathGeom, pathMat)
    pathMesh.position.set(centerX, 0.05, centerZ)
    pathMesh.receiveShadow = true
    this.mapGroup.add(pathMesh)
  }

  _buildGridOverlay() {
    // Subtle grid lines for building placement
    const material = new THREE.LineBasicMaterial({
      color: COLOR.GRID_LINE,
      transparent: true,
      opacity: 0.3,
    })

    const totalWidth = GRID.COLS * GRID.CELL_SIZE
    const totalHeight = GRID.ROWS * GRID.CELL_SIZE

    // Vertical lines
    for (let col = 0; col <= GRID.COLS; col++) {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(col * GRID.CELL_SIZE, 0.02, 0),
        new THREE.Vector3(col * GRID.CELL_SIZE, 0.02, totalHeight),
      ])
      this.mapGroup.add(new THREE.Line(geom, material))
    }

    // Horizontal lines
    for (let row = 0; row <= GRID.ROWS; row++) {
      const geom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.02, row * GRID.CELL_SIZE),
        new THREE.Vector3(totalWidth, 0.02, row * GRID.CELL_SIZE),
      ])
      this.mapGroup.add(new THREE.Line(geom, material))
    }
  }

  _buildMarkers() {
    // Spawn point marker (red)
    const spawnPos = this.grid.getWorldPosition(
      Math.max(0, MAP_PATH[0].x),
      MAP_PATH[0].z
    )
    const spawnGeom = new THREE.ConeGeometry(0.5, 1.5, 6)
    spawnGeom.rotateX(-Math.PI / 2)
    const spawnMat = new THREE.MeshPhongMaterial({
      color: COLOR.SPAWN,
      emissive: 0x441111,
    })
    const spawnMesh = new THREE.Mesh(spawnGeom, spawnMat)
    spawnMesh.position.set(
      MAP_PATH[0].x < 0 ? -GRID.CELL_SIZE / 2 : spawnPos.x,
      1,
      spawnPos.z
    )
    this.mapGroup.add(spawnMesh)

    // Base marker (blue)
    const lastWP = MAP_PATH[MAP_PATH.length - 1]
    const basePos = this.grid.getWorldPosition(
      Math.min(GRID.COLS - 1, lastWP.x),
      lastWP.z
    )
    const baseGeom = new THREE.BoxGeometry(GRID.CELL_SIZE * 1.2, 1.5, GRID.CELL_SIZE * 1.2)
    const baseMat = new THREE.MeshPhongMaterial({
      color: COLOR.BASE,
      emissive: 0x112244,
    })
    const baseMesh = new THREE.Mesh(baseGeom, baseMat)
    baseMesh.position.set(
      lastWP.x >= GRID.COLS ? GRID.COLS * GRID.CELL_SIZE + GRID.CELL_SIZE / 2 : basePos.x,
      0.75,
      basePos.z
    )
    this.mapGroup.add(baseMesh)

    // Flag on base
    const flagGeom = new THREE.CylinderGeometry(0.05, 0.05, 2, 8)
    const flagMat = new THREE.MeshBasicMaterial({ color: 0xcccccc })
    const flag = new THREE.Mesh(flagGeom, flagMat)
    flag.position.copy(baseMesh.position)
    flag.position.y += 1.5
    this.mapGroup.add(flag)
  }

  _buildHighlight() {
    const geom = new THREE.PlaneGeometry(GRID.CELL_SIZE, GRID.CELL_SIZE)
    geom.rotateX(-Math.PI / 2)
    const mat = new THREE.MeshBasicMaterial({
      color: COLOR.GRID_HIGHLIGHT,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    })
    this.highlightMesh = new THREE.Mesh(geom, mat)
    this.highlightMesh.visible = false
    this.highlightMesh.position.y = 0.05
    this.mapGroup.add(this.highlightMesh)
  }

  _buildRangeCircle() {
    const geom = new THREE.RingGeometry(4.9, 5, 32)
    geom.rotateX(-Math.PI / 2)
    const mat = new THREE.MeshBasicMaterial({
      color: COLOR.RANGE_CIRCLE,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
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
    const innerRadius = Math.max(0.01, range - 0.1)
    this.rangeCircle.geometry.dispose()
    this.rangeCircle.geometry = new THREE.RingGeometry(innerRadius, range, 32)
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

  reset() {
    this.grid.reset()
    this.grid.markPath(MAP_PATH)
  }
}
