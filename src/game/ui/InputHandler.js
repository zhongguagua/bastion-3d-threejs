// ==========================================
// Tower Defense Game - Input Handler
// ==========================================

import * as THREE from 'three'
import { GRID } from '../core/Constants'

export default class InputHandler {
  constructor(sceneRenderer, container) {
    this.renderer = sceneRenderer
    this.container = container
    this.camera = sceneRenderer.camera
    this.scene = sceneRenderer.scene

    // Raycaster for mouse picking
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    // Ground plane for raycasting
    this.groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)

    // Callbacks
    this.onCellClick = null
    this.onCellHover = null
    this.onRightClick = null
    this.onBackgroundClick = null

    // Bind events
    this._onMouseMove = this._handleMouseMove.bind(this)
    this._onLeftClick = this._handleLeftClick.bind(this)
    this._onRightClick = this._handleRightClick.bind(this)
    this._onContextMenu = (e) => e.preventDefault()
    this._onResize = this._handleResize.bind(this)

    this.container.addEventListener('mousemove', this._onMouseMove)
    this.container.addEventListener('click', this._onLeftClick)
    this.container.addEventListener('contextmenu', this._onContextMenu)
    this.container.addEventListener('contextmenu', this._onRightClick)
    window.addEventListener('resize', this._onResize)
  }

  _getIntersection(event) {
    const rect = this.container.getBoundingClientRect()
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    this.raycaster.setFromCamera(this.mouse, this.camera)

    const intersectPoint = new THREE.Vector3()
    this.raycaster.ray.intersectPlane(this.groundPlane, intersectPoint)

    return intersectPoint
  }

  _worldToGrid(worldPos) {
    const col = Math.floor(worldPos.x / GRID.CELL_SIZE)
    const row = Math.floor(worldPos.z / GRID.CELL_SIZE)
    return { col, row }
  }

  _handleMouseMove(event) {
    const point = this._getIntersection(event)
    if (!point) return

    const { col, row } = this._worldToGrid(point)
    if (this.onCellHover) this.onCellHover(col, row)
  }

  _handleLeftClick(event) {
    const point = this._getIntersection(event)
    if (!point) {
      if (this.onBackgroundClick) this.onBackgroundClick()
      return
    }

    const { col, row } = this._worldToGrid(point)
    if (col >= 0 && col < GRID.COLS && row >= 0 && row < GRID.ROWS) {
      if (this.onCellClick) this.onCellClick(col, row)
    } else {
      if (this.onBackgroundClick) this.onBackgroundClick()
    }
  }

  _handleRightClick() {
    if (this.onRightClick) this.onRightClick()
  }

  _handleResize() {
    this.renderer.handleResize()
  }

  destroy() {
    this.container.removeEventListener('mousemove', this._onMouseMove)
    this.container.removeEventListener('click', this._onLeftClick)
    this.container.removeEventListener('contextmenu', this._onContextMenu)
    this.container.removeEventListener('contextmenu', this._onRightClick)
    window.removeEventListener('resize', this._onResize)
  }
}
