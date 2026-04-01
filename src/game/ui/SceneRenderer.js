// ==========================================
// Tower Defense Game - Scene Renderer
// ==========================================

import * as THREE from 'three'
import { CAMERA, COLOR } from '../core/Constants'

export default class SceneRenderer {
  constructor(container) {
    this.container = container
    this.scene = null
    this.camera = null
    this.renderer = null

    this._initScene()
    this._initCamera()
    this._initRenderer()
    this._initLights()
  }

  _initScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(COLOR.SKY)
    this.scene.fog = new THREE.FogExp2(COLOR.SKY, 0.008)
  }

  _initCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight
    this.camera = new THREE.PerspectiveCamera(
      CAMERA.FOV,
      aspect,
      CAMERA.NEAR,
      CAMERA.FAR
    )
    this.camera.position.set(CAMERA.INITIAL_POS.x, CAMERA.INITIAL_POS.y, CAMERA.INITIAL_POS.z)
    this.camera.lookAt(CAMERA.LOOK_AT.x, CAMERA.LOOK_AT.y, CAMERA.LOOK_AT.z)
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement)
  }

  _initLights() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0x6688aa, 0.6)
    this.scene.add(ambient)

    // Main directional light (sun)
    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.0)
    dirLight.position.set(30, 40, 20)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    dirLight.shadow.camera.near = 1
    dirLight.shadow.camera.far = 100
    dirLight.shadow.camera.left = -40
    dirLight.shadow.camera.right = 40
    dirLight.shadow.camera.top = 40
    dirLight.shadow.camera.bottom = -40
    this.scene.add(dirLight)

    // Hemisphere light for natural outdoor feel
    const hemiLight = new THREE.HemisphereLight(0x88aacc, 0x445522, 0.4)
    this.scene.add(hemiLight)
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  handleResize() {
    if (!this.container) return
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  destroy() {
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement)
    }
    this.renderer && this.renderer.dispose()
  }
}
