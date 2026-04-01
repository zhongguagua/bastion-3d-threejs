// ==========================================
// Tower Defense Game - Grid System
// ==========================================

import * as THREE from 'three'

export default class Grid {
  constructor(cols, rows, cellSize) {
    this.cols = cols
    this.rows = rows
    this.cellSize = cellSize

    // Grid data: 0 = empty, 1 = path, 2 = tower
    this.cells = []
    this.towerMap = {}

    this._initCells()
  }

  _initCells() {
    this.cells = []
    for (let row = 0; row < this.rows; row++) {
      this.cells[row] = []
      for (let col = 0; col < this.cols; col++) {
        this.cells[row][col] = 0
      }
    }
  }

  markPath(waypoints) {
    for (let i = 0; i < waypoints.length - 1; i++) {
      const from = waypoints[i]
      const to = waypoints[i + 1]
      this._markSegment(from, to)
    }
  }

  _markSegment(from, to) {
    const dx = Math.sign(to.x - from.x)
    const dz = Math.sign(to.z - from.z)
    let x = from.x
    let z = from.z

    while (x !== to.x || z !== to.z) {
      if (x >= 0 && x < this.cols && z >= 0 && z < this.rows) {
        this.cells[z][x] = 1
      }
      if (x !== to.x) x += dx
      else if (z !== to.z) z += dz
    }
    if (to.x >= 0 && to.x < this.cols && to.z >= 0 && to.z < this.rows) {
      this.cells[to.z][to.x] = 1
    }
  }

  canBuild(col, row) {
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) return false
    return this.cells[row][col] === 0
  }

  placeTower(col, row, tower) {
    this.cells[row][col] = 2
    this.towerMap[`${col},${row}`] = tower
  }

  removeTower(col, row) {
    this.cells[row][col] = 0
    delete this.towerMap[`${col},${row}`]
  }

  getTowerAt(col, row) {
    return this.towerMap[`${col},${row}`] || null
  }

  getWorldPosition(col, row) {
    return new THREE.Vector3(
      col * this.cellSize + this.cellSize / 2,
      0,
      row * this.cellSize + this.cellSize / 2
    )
  }

  reset() {
    this._initCells()
    this.towerMap = {}
  }
}
