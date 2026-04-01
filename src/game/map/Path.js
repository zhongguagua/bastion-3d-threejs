// ==========================================
// Tower Defense Game - Path System
// ==========================================

import * as THREE from 'three'
import { MAP_PATH, GRID } from '../core/Constants'

export default class Path {
  constructor() {
    this.waypoints = []
    this.worldPoints = []
    this.totalLength = 0
    this.segmentLengths = []
    this.cumulativeLengths = []

    this._buildFromConfig()
  }

  _buildFromConfig() {
    this.waypoints = MAP_PATH.map(wp => ({ x: wp.x, z: wp.z }))

    // Convert to world coordinates
    this.worldPoints = this.waypoints.map(wp => new THREE.Vector3(
      wp.x * GRID.CELL_SIZE + GRID.CELL_SIZE / 2,
      0.5,
      wp.z * GRID.CELL_SIZE + GRID.CELL_SIZE / 2
    ))

    // Calculate lengths
    this.segmentLengths = []
    this.cumulativeLengths = [0]
    this.totalLength = 0

    for (let i = 0; i < this.worldPoints.length - 1; i++) {
      const len = this.worldPoints[i].distanceTo(this.worldPoints[i + 1])
      this.segmentLengths.push(len)
      this.totalLength += len
      this.cumulativeLengths.push(this.totalLength)
    }
  }

  // Get position along the path by progress (0-1)
  getPositionAtProgress(progress) {
    const distance = progress * this.totalLength
    return this.getPositionAtDistance(distance)
  }

  getPositionAtDistance(distance) {
    if (distance <= 0) return this.worldPoints[0].clone()
    if (distance >= this.totalLength) return this.worldPoints[this.worldPoints.length - 1].clone()

    // Find segment
    for (let i = 0; i < this.segmentLengths.length; i++) {
      if (distance <= this.cumulativeLengths[i + 1]) {
        const segStart = this.cumulativeLengths[i]
        const segProgress = (distance - segStart) / this.segmentLengths[i]
        return new THREE.Vector3().lerpVectors(
          this.worldPoints[i],
          this.worldPoints[i + 1],
          segProgress
        )
      }
    }

    return this.worldPoints[this.worldPoints.length - 1].clone()
  }

  // Get direction at distance
  getDirectionAtDistance(distance) {
    const pos1 = this.getPositionAtDistance(distance)
    const pos2 = this.getPositionAtDistance(distance + 0.1)
    return pos2.sub(pos1).normalize()
  }
}
