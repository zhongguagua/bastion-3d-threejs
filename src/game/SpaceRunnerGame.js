import * as THREE from 'three'

// 游戏状态常量
export const GAME_STATE = {
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAMEOVER: 'gameover'
}

// 游戏配置
const CONFIG = {
  // 场景
  FIELD_WIDTH: 20,
  FIELD_HEIGHT: 14,
  FIELD_DEPTH: 120,

  // 玩家
  PLAYER_SPEED: 12,
  PLAYER_MAX_HP: 100,
  PLAYER_INVINCIBLE_TIME: 1.5,

  // 小行星
  ASTEROID_BASE_SPEED: 15,
  ASTEROID_SPAWN_INTERVAL: 0.8,
  ASTEROID_MIN_SIZE: 0.4,
  ASTEROID_MAX_SIZE: 1.8,
  ASTEROID_DAMAGE: 25,

  // 能量球
  ORB_SPAWN_INTERVAL: 3.0,
  ORB_SPEED: 15,
  ORB_SCORE: 50,
  ORB_HEAL: 15,
  ORB_SIZE: 0.5,
  ORB_SHIELD_SCORE: 100,
  ORB_SHIELD_HEAL: 30,

  // 星场
  STAR_COUNT: 2000,
  STAR_FIELD_SIZE: 100,

  // 难度
  SPEED_INCREASE_RATE: 0.3,
  SPAWN_DECREASE_RATE: 0.02,
  MIN_SPAWN_INTERVAL: 0.25,

  // 分数
  SCORE_PER_SECOND: 10,
}

export default class SpaceRunnerGame {
  constructor(container) {
    this.container = container
    this.state = GAME_STATE.READY
    this.score = 0
    this.hp = CONFIG.PLAYER_MAX_HP
    this.speed = CONFIG.ASTEROID_BASE_SPEED
    this.shield = false
    this.shieldTimer = 0
    this.invincibleTimer = 0
    this.elapsedTime = 0
    this.spawnTimer = 0
    this.orbSpawnTimer = 0
    this.animationId = null
    this.lastTime = 0

    // 输入状态
    this.keys = {}

    // Three.js 对象
    this.scene = null
    this.camera = null
    this.renderer = null
    this.player = null
    this.playerGroup = null
    this.shieldMesh = null
    this.asteroids = []
    this.orbs = []
    this.stars = null
    this.explosions = []
    this.directionLight = null

    // 回调
    this.onStateChange = null
    this.onScoreChange = null
    this.onHpChange = null
    this.onShieldChange = null

    this._init()
  }

  _init() {
    this._initScene()
    this._initCamera()
    this._initRenderer()
    this._initLights()
    this._initStars()
    this._initPlayer()
    this._initEventListeners()
  }

  // ========== 场景初始化 ==========

  _initScene() {
    this.scene = new THREE.Scene()
    this.scene.fog = new THREE.FogExp2(0x000011, 0.008)
    this.scene.background = new THREE.Color(0x000011)
  }

  _initCamera() {
    const aspect = this.container.clientWidth / this.container.clientHeight
    this.camera = new THREE.PerspectiveCamera(65, aspect, 0.1, 300)
    this.camera.position.set(0, 4, 12)
    this.camera.lookAt(0, 0, -20)
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement)
  }

  _initLights() {
    // 环境光
    const ambient = new THREE.AmbientLight(0x334466, 0.6)
    this.scene.add(ambient)

    // 方向光（模拟远处恒星）
    this.directionLight = new THREE.DirectionalLight(0xffffff, 1.0)
    this.directionLight.position.set(5, 10, 10)
    this.directionLight.castShadow = true
    this.scene.add(this.directionLight)

    // 背面补光
    const backLight = new THREE.DirectionalLight(0x4488ff, 0.3)
    backLight.position.set(-5, -3, -10)
    this.scene.add(backLight)

    // 点光源跟随飞船
    this.playerLight = new THREE.PointLight(0x00aaff, 1.5, 20)
    this.playerLight.position.set(0, 2, 0)
    this.scene.add(this.playerLight)
  }

  _initStars() {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(CONFIG.STAR_COUNT * 3)
    const colors = new Float32Array(CONFIG.STAR_COUNT * 3)
    const sizes = new Float32Array(CONFIG.STAR_COUNT)

    for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
      const i3 = i * 3
      positions[i3] = (Math.random() - 0.5) * CONFIG.STAR_FIELD_SIZE * 2
      positions[i3 + 1] = (Math.random() - 0.5) * CONFIG.STAR_FIELD_SIZE
      positions[i3 + 2] = (Math.random() - 0.5) * CONFIG.STAR_FIELD_SIZE * 4 - 30

      // 星星颜色变化
      const colorChoice = Math.random()
      if (colorChoice < 0.3) {
        colors[i3] = 0.8; colors[i3 + 1] = 0.85; colors[i3 + 2] = 1.0
      } else if (colorChoice < 0.6) {
        colors[i3] = 1.0; colors[i3 + 1] = 0.95; colors[i3 + 2] = 0.8
      } else {
        colors[i3] = 1.0; colors[i3 + 1] = 1.0; colors[i3 + 2] = 1.0
      }
      sizes[i] = Math.random() * 2 + 0.5
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })

    this.stars = new THREE.Points(geometry, material)
    this.scene.add(this.stars)
  }

  _initPlayer() {
    this.playerGroup = new THREE.Group()

    // 飞船主体 - 流线型
    const bodyGeom = new THREE.ConeGeometry(0.5, 2.5, 8)
    bodyGeom.rotateX(Math.PI / 2)
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0x2288ff,
      emissive: 0x112244,
      shininess: 80,
      specular: 0x4488ff,
    })
    const body = new THREE.Mesh(bodyGeom, bodyMat)
    this.playerGroup.add(body)

    // 驾驶舱
    const cockpitGeom = new THREE.SphereGeometry(0.35, 8, 6)
    const cockpitMat = new THREE.MeshPhongMaterial({
      color: 0x66ccff,
      emissive: 0x2266aa,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
    })
    const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat)
    cockpit.position.set(0, 0.2, -0.3)
    cockpit.scale.set(1, 0.6, 1.2)
    this.playerGroup.add(cockpit)

    // 左翼
    const wingShape = new THREE.Shape()
    wingShape.moveTo(0, 0)
    wingShape.lineTo(-2.2, -0.3)
    wingShape.lineTo(-1.0, 0.8)
    wingShape.lineTo(0, 0.3)
    const wingGeom = new THREE.ExtrudeGeometry(wingShape, { depth: 0.05, bevelEnabled: false })
    const wingMat = new THREE.MeshPhongMaterial({
      color: 0x1a66cc,
      emissive: 0x0a1a44,
      shininess: 60,
    })
    const leftWing = new THREE.Mesh(wingGeom, wingMat)
    leftWing.position.set(-0.3, -0.1, 0)
    leftWing.rotation.x = -0.1
    this.playerGroup.add(leftWing)

    // 右翼
    const rightWingShape = new THREE.Shape()
    rightWingShape.moveTo(0, 0)
    rightWingShape.lineTo(2.2, -0.3)
    rightWingShape.lineTo(1.0, 0.8)
    rightWingShape.lineTo(0, 0.3)
    const rightWingGeom = new THREE.ExtrudeGeometry(rightWingShape, { depth: 0.05, bevelEnabled: false })
    const rightWing = new THREE.Mesh(rightWingGeom, wingMat.clone())
    rightWing.position.set(0.3, -0.1, 0)
    rightWing.rotation.x = -0.1
    this.playerGroup.add(rightWing)

    // 引擎发光
    const engineGeom = new THREE.CylinderGeometry(0.15, 0.25, 0.4, 8)
    engineGeom.rotateX(Math.PI / 2)
    const engineMat = new THREE.MeshBasicMaterial({ color: 0x00aaff })
    const engineL = new THREE.Mesh(engineGeom, engineMat)
    engineL.position.set(-0.5, -0.1, 1.2)
    this.playerGroup.add(engineL)

    const engineR = engineL.clone()
    engineR.position.set(0.5, -0.1, 1.2)
    this.playerGroup.add(engineR)

    // 引擎火焰
    const flameGeom = new THREE.ConeGeometry(0.2, 1.2, 6)
    flameGeom.rotateX(-Math.PI / 2)
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x00ccff,
      transparent: true,
      opacity: 0.6,
    })
    this.flameL = new THREE.Mesh(flameGeom, flameMat)
    this.flameL.position.set(-0.5, -0.1, 2.0)
    this.playerGroup.add(this.flameL)

    this.flameR = this.flameL.clone()
    this.flameR.position.set(0.5, -0.1, 2.0)
    this.playerGroup.add(this.flameR)

    this.playerGroup.position.set(0, 0, 0)
    this.scene.add(this.playerGroup)

    // 护盾可视化
    const shieldGeom = new THREE.SphereGeometry(1.5, 16, 12)
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x44ddff,
      transparent: true,
      opacity: 0.0,
      wireframe: true,
    })
    this.shieldMesh = new THREE.Mesh(shieldGeom, shieldMat)
    this.playerGroup.add(this.shieldMesh)

    // 碰撞盒
    this.playerBox = new THREE.Box3()
  }

  // ========== 事件监听 ==========

  _initEventListeners() {
    this._onKeyDown = (e) => {
      this.keys[e.code] = true
      if (e.code === 'Space') {
        e.preventDefault()
        this._handleSpacePress()
      }
    }
    this._onKeyUp = (e) => {
      this.keys[e.code] = false
    }
    this._onResize = () => this._handleResize()

    window.addEventListener('keydown', this._onKeyDown)
    window.addEventListener('keyup', this._onKeyUp)
    window.addEventListener('resize', this._onResize)
  }

  _handleSpacePress() {
    if (this.state === GAME_STATE.READY || this.state === GAME_STATE.GAMEOVER) {
      this.start()
    } else if (this.state === GAME_STATE.PLAYING) {
      this.pause()
    } else if (this.state === GAME_STATE.PAUSED) {
      this.resume()
    }
  }

  _handleResize() {
    if (!this.container) return
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  // ========== 游戏控制 ==========

  start() {
    this._reset()
    this.state = GAME_STATE.PLAYING
    this.lastTime = performance.now()
    this._notifyStateChange()
    this._gameLoop()
  }

  pause() {
    this.state = GAME_STATE.PAUSED
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this._notifyStateChange()
  }

  resume() {
    this.state = GAME_STATE.PLAYING
    this.lastTime = performance.now()
    this._notifyStateChange()
    this._gameLoop()
  }

  _reset() {
    this.score = 0
    this.hp = CONFIG.PLAYER_MAX_HP
    this.speed = CONFIG.ASTEROID_BASE_SPEED
    this.shield = false
    this.shieldTimer = 0
    this.invincibleTimer = 0
    this.elapsedTime = 0
    this.spawnTimer = 0
    this.orbSpawnTimer = 0

    // 清除小行星
    this.asteroids.forEach(a => this.scene.remove(a.mesh))
    this.asteroids = []

    // 清除能量球
    this.orbs.forEach(o => this.scene.remove(o.mesh))
    this.orbs = []

    // 清除爆炸
    this.explosions.forEach(e => this.scene.remove(e.particles))
    this.explosions = []

    // 重置玩家位置
    this.playerGroup.position.set(0, 0, 0)
    this.playerGroup.rotation.set(0, 0, 0)
    this.shieldMesh.material.opacity = 0.0

    this._notifyScoreChange()
    this._notifyHpChange()
    this._notifyShieldChange()
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    window.removeEventListener('keydown', this._onKeyDown)
    window.removeEventListener('keyup', this._onKeyUp)
    window.removeEventListener('resize', this._onResize)
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement)
    }
    this.renderer && this.renderer.dispose()
  }

  // ========== 游戏循环 ==========

  _gameLoop() {
    if (this.state !== GAME_STATE.PLAYING) return

    this.animationId = requestAnimationFrame(() => this._gameLoop())

    const now = performance.now()
    const dt = Math.min((now - this.lastTime) / 1000, 0.05)
    this.lastTime = now

    this.elapsedTime += dt

    this._updateDifficulty()
    this._updatePlayer(dt)
    this._updateStars(dt)
    this._spawnAsteroids(dt)
    this._spawnOrbs(dt)
    this._updateAsteroids(dt)
    this._updateOrbs(dt)
    this._updateExplosions(dt)
    this._checkCollisions()
    this._updateScore(dt)
    this._updateTimers(dt)
    this._updateVisualEffects(dt)

    this.renderer.render(this.scene, this.camera)
  }

  // ========== 更新逻辑 ==========

  _updateDifficulty() {
    this.speed = CONFIG.ASTEROID_BASE_SPEED + this.elapsedTime * CONFIG.SPEED_INCREASE_RATE
  }

  _updatePlayer(dt) {
    if (!this.playerGroup) return

    const moveSpeed = CONFIG.PLAYER_SPEED * dt
    const halfW = CONFIG.FIELD_WIDTH / 2 - 1
    const halfH = CONFIG.FIELD_HEIGHT / 2 - 1

    let targetTiltZ = 0
    let targetTiltX = 0

    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.playerGroup.position.x -= moveSpeed
      targetTiltZ = 0.3
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.playerGroup.position.x += moveSpeed
      targetTiltZ = -0.3
    }
    if (this.keys['ArrowUp'] || this.keys['KeyW']) {
      this.playerGroup.position.y += moveSpeed
      targetTiltX = -0.2
    }
    if (this.keys['ArrowDown'] || this.keys['KeyS']) {
      this.playerGroup.position.y -= moveSpeed
      targetTiltX = 0.2
    }

    // 边界限制
    this.playerGroup.position.x = Math.max(-halfW, Math.min(halfW, this.playerGroup.position.x))
    this.playerGroup.position.y = Math.max(-halfH, Math.min(halfH, this.playerGroup.position.y))

    // 平滑倾斜
    this.playerGroup.rotation.z += (targetTiltZ - this.playerGroup.rotation.z) * 5 * dt
    this.playerGroup.rotation.x += (targetTiltX - this.playerGroup.rotation.x) * 5 * dt

    // 更新跟随灯光
    this.playerLight.position.copy(this.playerGroup.position)
    this.playerLight.position.y += 2

    // 更新碰撞盒
    this.playerBox.setFromCenterAndSize(
      this.playerGroup.position,
      new THREE.Vector3(1.5, 1.0, 2.5)
    )
  }

  _updateStars(dt) {
    if (!this.stars) return
    const positions = this.stars.geometry.attributes.position.array
    const moveAmount = this.speed * dt * 0.3

    for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
      const i3 = i * 3
      positions[i3 + 2] += moveAmount
      if (positions[i3 + 2] > 50) {
        positions[i3 + 2] = -130
        positions[i3] = (Math.random() - 0.5) * CONFIG.STAR_FIELD_SIZE * 2
        positions[i3 + 1] = (Math.random() - 0.5) * CONFIG.STAR_FIELD_SIZE
      }
    }
    this.stars.geometry.attributes.position.needsUpdate = true
  }

  _spawnAsteroids(dt) {
    const interval = Math.max(
      CONFIG.MIN_SPAWN_INTERVAL,
      CONFIG.ASTEROID_SPAWN_INTERVAL - this.elapsedTime * CONFIG.SPAWN_DECREASE_RATE
    )
    this.spawnTimer += dt
    if (this.spawnTimer < interval) return
    this.spawnTimer = 0

    const size = CONFIG.ASTEROID_MIN_SIZE + Math.random() * (CONFIG.ASTEROID_MAX_SIZE - CONFIG.ASTEROID_MIN_SIZE)
    const detailLevel = Math.floor(Math.random() * 2) + 1
    const geom = new THREE.IcosahedronGeometry(size, detailLevel)

    // 随机变形让小行星更自然
    const posAttr = geom.attributes.position
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i)
      const y = posAttr.getY(i)
      const z = posAttr.getZ(i)
      const offset = 0.8 + Math.random() * 0.4
      posAttr.setXYZ(i, x * offset, y * offset, z * offset)
    }
    geom.computeVertexNormals()

    // 颜色随机
    const hue = 0.05 + Math.random() * 0.08
    const color = new THREE.Color().setHSL(hue, 0.4 + Math.random() * 0.3, 0.25 + Math.random() * 0.2)
    const mat = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color.clone().multiplyScalar(0.15),
      shininess: 10,
      flatShading: true,
    })

    const mesh = new THREE.Mesh(geom, mat)
    mesh.position.set(
      (Math.random() - 0.5) * CONFIG.FIELD_WIDTH,
      (Math.random() - 0.5) * CONFIG.FIELD_HEIGHT,
      -CONFIG.FIELD_DEPTH + Math.random() * 10
    )
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
    this.scene.add(mesh)

    const rotSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2,
      (Math.random() - 0.5) * 2
    )

    this.asteroids.push({ mesh, size, rotSpeed })
  }

  _spawnOrbs(dt) {
    this.orbSpawnTimer += dt
    if (this.orbSpawnTimer < CONFIG.ORB_SPAWN_INTERVAL) return
    this.orbSpawnTimer = 0

    const isShield = Math.random() < 0.25
    const orbSize = CONFIG.ORB_SIZE

    // 外层发光球
    const group = new THREE.Group()

    const geom = new THREE.OctahedronGeometry(orbSize, 2)
    const color = isShield ? 0xffaa00 : 0x00ffaa
    const mat = new THREE.MeshPhongMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.85,
    })
    const core = new THREE.Mesh(geom, mat)
    group.add(core)

    // 光环
    const ringGeom = new THREE.TorusGeometry(orbSize * 1.5, 0.05, 8, 24)
    const ringMat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.5,
    })
    const ring = new THREE.Mesh(ringGeom, ringMat)
    group.add(ring)

    // 点光源
    const orbLight = new THREE.PointLight(color, 1.0, 8)
    group.add(orbLight)

    group.position.set(
      (Math.random() - 0.5) * CONFIG.FIELD_WIDTH * 0.8,
      (Math.random() - 0.5) * CONFIG.FIELD_HEIGHT * 0.8,
      -CONFIG.FIELD_DEPTH + Math.random() * 10
    )
    this.scene.add(group)

    this.orbs.push({ mesh: group, core, ring, isShield, size: orbSize })
  }

  _updateAsteroids(dt) {
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i]
      asteroid.mesh.position.z += this.speed * dt
      asteroid.mesh.rotation.x += asteroid.rotSpeed.x * dt
      asteroid.mesh.rotation.y += asteroid.rotSpeed.y * dt
      asteroid.mesh.rotation.z += asteroid.rotSpeed.z * dt

      if (asteroid.mesh.position.z > 20) {
        this.scene.remove(asteroid.mesh)
        asteroid.mesh.geometry.dispose()
        asteroid.mesh.material.dispose()
        this.asteroids.splice(i, 1)
      }
    }
  }

  _updateOrbs(dt) {
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const orb = this.orbs[i]
      orb.mesh.position.z += this.speed * dt * 0.9
      orb.core.rotation.y += 2 * dt
      orb.ring.rotation.x += 1.5 * dt
      orb.ring.rotation.z += 1.0 * dt

      if (orb.mesh.position.z > 20) {
        this.scene.remove(orb.mesh)
        this.orbs.splice(i, 1)
      }
    }
  }

  _updateExplosions(dt) {
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const explosion = this.explosions[i]
      explosion.life -= dt

      if (explosion.life <= 0) {
        this.scene.remove(explosion.particles)
        explosion.particles.geometry.dispose()
        explosion.particles.material.dispose()
        this.explosions.splice(i, 1)
        continue
      }

      const positions = explosion.particles.geometry.attributes.position.array
      const velocities = explosion.velocities
      const progress = 1 - explosion.life / explosion.maxLife

      for (let j = 0; j < explosion.count; j++) {
        const j3 = j * 3
        positions[j3] += velocities[j3] * dt
        positions[j3 + 1] += velocities[j3 + 1] * dt
        positions[j3 + 2] += velocities[j3 + 2] * dt
        // 减速
        velocities[j3] *= 0.98
        velocities[j3 + 1] *= 0.98
        velocities[j3 + 2] *= 0.98
      }
      explosion.particles.geometry.attributes.position.needsUpdate = true
      explosion.particles.material.opacity = 1 - progress
    }
  }

  _checkCollisions() {
    // 玩家 vs 小行星
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      const asteroid = this.asteroids[i]
      const asteroidBox = new THREE.Box3().setFromCenterAndSize(
        asteroid.mesh.position,
        new THREE.Vector3(asteroid.size * 1.5, asteroid.size * 1.5, asteroid.size * 1.5)
      )

      if (this.playerBox.intersectsBox(asteroidBox)) {
        this._createExplosion(asteroid.mesh.position, asteroid.size > 1 ? 0xff6633 : 0xff8844, 20)
        this.scene.remove(asteroid.mesh)
        asteroid.mesh.geometry.dispose()
        asteroid.mesh.material.dispose()
        this.asteroids.splice(i, 1)

        if (this.invincibleTimer <= 0) {
          if (this.shield) {
            this.shield = false
            this.shieldTimer = 0
            this._notifyShieldChange()
          } else {
            this.hp -= CONFIG.ASTEROID_DAMAGE
            this.invincibleTimer = CONFIG.PLAYER_INVINCIBLE_TIME
            this._notifyHpChange()

            if (this.hp <= 0) {
              this.hp = 0
              this._gameOver()
              return
            }
          }
        }
      }
    }

    // 玩家 vs 能量球
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const orb = this.orbs[i]
      const orbBox = new THREE.Box3().setFromCenterAndSize(
        orb.mesh.position,
        new THREE.Vector3(orb.size * 3, orb.size * 3, orb.size * 3)
      )

      if (this.playerBox.intersectsBox(orbBox)) {
        const color = orb.isShield ? 0xffaa00 : 0x00ffaa
        this._createExplosion(orb.mesh.position, color, 15)

        if (orb.isShield) {
          this.shield = true
          this.shieldTimer = 10
          this.score += CONFIG.ORB_SHIELD_SCORE
          this._notifyShieldChange()
        } else {
          this.score += CONFIG.ORB_SCORE
          this.hp = Math.min(CONFIG.PLAYER_MAX_HP, this.hp + CONFIG.ORB_HEAL)
          this._notifyHpChange()
        }
        this._notifyScoreChange()

        this.scene.remove(orb.mesh)
        this.orbs.splice(i, 1)
      }
    }
  }

  _createExplosion(position, color, count) {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3] = position.x
      positions[i3 + 1] = position.y
      positions[i3 + 2] = position.z

      velocities[i3] = (Math.random() - 0.5) * 15
      velocities[i3 + 1] = (Math.random() - 0.5) * 15
      velocities[i3 + 2] = (Math.random() - 0.5) * 15
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: color,
      size: 0.3,
      transparent: true,
      opacity: 1.0,
    })

    const particles = new THREE.Points(geometry, material)
    this.scene.add(particles)

    const maxLife = 0.8
    this.explosions.push({
      particles,
      velocities,
      count,
      life: maxLife,
      maxLife,
    })
  }

  _updateScore(dt) {
    this.score += CONFIG.SCORE_PER_SECOND * dt
    this._notifyScoreChange()
  }

  _updateTimers(dt) {
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= dt
    }

    if (this.shield && this.shieldTimer > 0) {
      this.shieldTimer -= dt
      if (this.shieldTimer <= 0) {
        this.shield = false
        this._notifyShieldChange()
      }
    }
  }

  _updateVisualEffects(dt) {
    // 引擎火焰闪烁
    if (this.flameL && this.flameR) {
      const flicker = 0.8 + Math.sin(this.elapsedTime * 20) * 0.2
      const flameScale = flicker * (this.speed / CONFIG.ASTEROID_BASE_SPEED) * 0.5
      this.flameL.scale.set(1, Math.max(0.3, flameScale), 1)
      this.flameR.scale.set(1, Math.max(0.3, flameScale), 1)
      this.flameL.material.opacity = 0.3 + Math.random() * 0.4
      this.flameR.material.opacity = 0.3 + Math.random() * 0.4
    }

    // 护盾效果
    if (this.shieldMesh) {
      const targetOpacity = this.shield ? 0.25 : 0.0
      this.shieldMesh.material.opacity += (targetOpacity - this.shieldMesh.material.opacity) * 5 * dt
      if (this.shield) {
        this.shieldMesh.rotation.y += 1.5 * dt
        this.shieldMesh.rotation.x += 0.8 * dt
      }
    }

    // 无敌闪烁
    if (this.invincibleTimer > 0 && this.playerGroup) {
      this.playerGroup.visible = Math.sin(this.elapsedTime * 30) > 0
    } else if (this.playerGroup) {
      this.playerGroup.visible = true
    }
  }

  _gameOver() {
    this.state = GAME_STATE.GAMEOVER
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
    this._notifyStateChange()
    this._notifyHpChange()
    // 最后渲染一帧
    this.renderer.render(this.scene, this.camera)
  }

  // ========== 通知回调 ==========

  _notifyStateChange() {
    if (this.onStateChange) this.onStateChange(this.state)
  }

  _notifyScoreChange() {
    if (this.onScoreChange) this.onScoreChange(Math.floor(this.score))
  }

  _notifyHpChange() {
    if (this.onHpChange) this.onHpChange(this.hp)
  }

  _notifyShieldChange() {
    if (this.onShieldChange) this.onShieldChange(this.shield, this.shieldTimer)
  }
}
