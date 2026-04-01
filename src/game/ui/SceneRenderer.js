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

    // Idle render loop — keeps environment animating even when game is paused/not started
    this._idleRenderActive = true
    this._idleRender()
  }

  _initScene() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(COLOR.SKY)
    // Linear fog for depth atmosphere — tuned to blend environment into sky
    this.scene.fog = new THREE.Fog(COLOR.FOG, 25, 90)
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
    // --- Large outer ground plane (extends far beyond the board) ---
    const groundGeom = new THREE.PlaneGeometry(200, 200)
    groundGeom.rotateX(-Math.PI / 2)
    const groundMat = new THREE.MeshStandardMaterial({
      color: COLOR.ENV_GROUND,
      roughness: 1.0,
      metalness: 0.0,
    })
    const ground = new THREE.Mesh(groundGeom, groundMat)
    ground.position.set(20, -0.3, 14)
    ground.receiveShadow = true
    this.scene.add(ground)

    // --- Distant hills (low-poly hemispheres, far from board and camera) ---
    // Board spans x:[0,40] z:[0,28], camera at (20,22,38) looking at (20,0,12)
    const hillData = [
      // Far-left rear — well outside board, won't block view
      { x: -45, z: -20, r: 18, h: 6, color: COLOR.HILL_COLOR },
      // Far-right rear
      { x: 85, z: -15, r: 20, h: 8, color: COLOR.HILL_COLOR },
      // Left side, far behind board
      { x: -40, z: 55, r: 22, h: 5, color: COLOR.HILL_COLOR_FAR },
      // Right side, far behind board
      { x: 80, z: 50, r: 16, h: 7, color: COLOR.HILL_COLOR_FAR },
      // Rear center, but far enough to not block camera
      { x: 20, z: -45, r: 25, h: 4, color: COLOR.HILL_COLOR },
    ]

    hillData.forEach(hd => {
      const hillGeom = new THREE.SphereGeometry(hd.r, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2)
      const hillMat = new THREE.MeshStandardMaterial({
        color: hd.color,
        roughness: 1.0,
        metalness: 0.0,
        flatShading: true,
      })
      const hill = new THREE.Mesh(hillGeom, hillMat)
      hill.position.set(hd.x, -0.3, hd.z)
      hill.scale.y = hd.h / hd.r
      this.scene.add(hill)
    })

    // --- Ambient floating particles ---
    const particleCount = 60
    const particleGeom = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    this._particleBasePositions = [] // for animation

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.3) * 80
      const y = Math.random() * 12 + 1
      const z = (Math.random() - 0.2) * 60
      particlePositions[i * 3] = x
      particlePositions[i * 3 + 1] = y
      particlePositions[i * 3 + 2] = z
      this._particleBasePositions.push({ x, y, z, phase: Math.random() * Math.PI * 2 })
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: COLOR.PARTICLE_COLOR,
      size: 0.2,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
      depthWrite: false,
    })

    this._ambientParticles = new THREE.Points(particleGeom, particleMat)
    this.scene.add(this._ambientParticles)

    // --- Subtle ground-level glow plane under the board ---
    const glowGeom = new THREE.PlaneGeometry(120, 120)
    glowGeom.rotateX(-Math.PI / 2)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x112211,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
    })
    const glowPlane = new THREE.Mesh(glowGeom, glowMat)
    glowPlane.position.set(20, -0.2, 14)
    this.scene.add(glowPlane)
  }

  // eslint-disable-next-line no-unused-vars
  updateAtmosphere(dt) {
    // Animate ambient floating particles
    if (this._ambientParticles) {
      const positions = this._ambientParticles.geometry.attributes.position.array
      const time = Date.now() * 0.001

      for (let i = 0; i < this._particleBasePositions.length; i++) {
        const base = this._particleBasePositions[i]
        positions[i * 3] = base.x + Math.sin(time + base.phase) * 0.5
        positions[i * 3 + 1] = base.y + Math.sin(time * 0.7 + base.phase * 1.3) * 0.8
        positions[i * 3 + 2] = base.z + Math.cos(time * 0.5 + base.phase) * 0.5
      }

      this._ambientParticles.geometry.attributes.position.needsUpdate = true
    }
  }

  render() {
    // Called during active gameplay — disable idle loop while game runs its own loop
    this._idleRenderActive = false
    this.renderer.render(this.scene, this.camera)
  }

  _idleRender() {
    if (!this._idleRenderActive) return
    requestAnimationFrame(() => this._idleRender())
    this.updateAtmosphere(0.016)
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
    this._idleRenderActive = false
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement)
    }
    this.renderer && this.renderer.dispose()
  }
}
