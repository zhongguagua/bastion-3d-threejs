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
    this.clock = new THREE.Clock()

    this._initScene()
    this._initCamera()
    this._initRenderer()
    this._initLights()
    this._initAtmosphere()
  }

  _initScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(COLOR.SKY)
    // Linear fog for depth atmosphere
    this.scene.fog = new THREE.Fog(COLOR.FOG, 30, 90)
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
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Tone mapping for richer colors and HDR-like look
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.1

    // Shadows
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

    this.container.appendChild(this.renderer.domElement)
  }

  _initLights() {
    // Ambient light - subtle fill
    const ambient = new THREE.AmbientLight(0x334455, 0.4)
    this.scene.add(ambient)

    // Main directional light (sun) - warm and angled for dramatic shadows
    const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2)
    dirLight.position.set(25, 45, 15)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.width = 2048
    dirLight.shadow.mapSize.height = 2048
    dirLight.shadow.camera.near = 1
    dirLight.shadow.camera.far = 120
    dirLight.shadow.camera.left = -45
    dirLight.shadow.camera.right = 45
    dirLight.shadow.camera.top = 45
    dirLight.shadow.camera.bottom = -45
    dirLight.shadow.bias = -0.001
    dirLight.shadow.normalBias = 0.02
    this.scene.add(dirLight)

    // Hemisphere light - sky/ground color blending
    const hemiLight = new THREE.HemisphereLight(
      0x6688aa,  // sky - cool blue
      0x223311,  // ground - dark green
      0.5
    )
    hemiLight.position.set(0, 30, 0)
    this.scene.add(hemiLight)

    // Fill light from opposite side to reduce harsh shadows
    const fillLight = new THREE.DirectionalLight(0x8899bb, 0.3)
    fillLight.position.set(-20, 20, -10)
    this.scene.add(fillLight)

    // Rim light from behind for edge definition
    const rimLight = new THREE.DirectionalLight(0xffeedd, 0.25)
    rimLight.position.set(0, 10, -30)
    this.scene.add(rimLight)
  }

  _initAtmosphere() {
    // Ground-level ambient glow plane
    const glowGeom = new THREE.PlaneGeometry(120, 120)
    glowGeom.rotateX(-Math.PI / 2)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x112211,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    })
    const glowPlane = new THREE.Mesh(glowGeom, glowMat)
    glowPlane.position.set(20, -0.5, 14)
    this.scene.add(glowPlane)
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
