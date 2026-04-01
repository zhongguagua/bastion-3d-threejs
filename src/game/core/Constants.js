// ==========================================
// Tower Defense Game - Global Constants
// ==========================================

export const GAME_STATE = {
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAMEOVER: 'gameover',
  VICTORY: 'victory',
}

export const GRID = {
  COLS: 20,
  ROWS: 14,
  CELL_SIZE: 2,
  PATH_WIDTH: 1,
}

export const CAMERA = {
  INITIAL_POS: { x: 20, y: 22, z: 38 },
  LOOK_AT: { x: 20, y: 0, z: 12 },
  FOV: 55,
  NEAR: 0.1,
  FAR: 200,
  MIN_DISTANCE: 20,
  MAX_DISTANCE: 80,
  ROTATION_SPEED: 0.005,
  ZOOM_SPEED: 2,
}

export const PLAYER = {
  INITIAL_GOLD: 250,
  INITIAL_LIVES: 20,
  MAX_LIVES: 20,
}

export const TOWER = {
  TYPES: {
    ARROW: 'arrow',
    CANNON: 'cannon',
    ICE: 'ice',
    LIGHTNING: 'lightning',
    SNIPER: 'sniper',
  },
  MAX_LEVEL: 3,
  SELL_RATIO: 0.6,
  RANGE_CIRCLE_SEGMENTS: 32,
}

export const TOWER_STATS = {
  [TOWER.TYPES.ARROW]: {
    name: '箭塔',
    description: '快速攻击，单体伤害',
    cost: [50, 80, 120],
    damage: [8, 15, 25],
    range: [5, 6, 7],
    fireRate: [0.4, 0.35, 0.3],
    color: [0x33cc66, 0x44dd77, 0x55ee88],
    emissive: [0x0a3318, 0x0d4420, 0x115528],
    projectileSpeed: 25,
  },
  [TOWER.TYPES.CANNON]: {
    name: '炮塔',
    description: '范围伤害，攻速慢',
    cost: [100, 150, 220],
    damage: [25, 45, 70],
    range: [5, 5.5, 6],
    fireRate: [1.5, 1.3, 1.0],
    color: [0xdd7733, 0xee8844, 0xff9955],
    emissive: [0x331a0a, 0x442200, 0x553300],
    projectileSpeed: 12,
    splashRadius: [2, 2.5, 3],
  },
  [TOWER.TYPES.ICE]: {
    name: '冰塔',
    description: '减速敌人',
    cost: [75, 120, 180],
    damage: [5, 8, 12],
    range: [5, 6, 7],
    fireRate: [0.8, 0.7, 0.6],
    color: [0x44bbee, 0x55ccff, 0x66ddff],
    emissive: [0x0a2233, 0x0d3344, 0x114455],
    projectileSpeed: 18,
    slowFactor: [0.5, 0.4, 0.3],
    slowDuration: [2, 2.5, 3],
  },
  [TOWER.TYPES.LIGHTNING]: {
    name: '电塔',
    description: '链式闪电攻击多个目标',
    cost: [125, 200, 300],
    damage: [15, 25, 40],
    range: [6, 6.5, 7],
    fireRate: [1.2, 1.0, 0.8],
    color: [0xcccc33, 0xdddd44, 0xeeee55],
    emissive: [0x33330a, 0x44440d, 0x555511],
    chainCount: [2, 3, 4],
    chainDamageFactor: 0.7,
  },
  [TOWER.TYPES.SNIPER]: {
    name: '狙击塔',
    description: '超远射程，高单体伤害',
    cost: [150, 230, 350],
    damage: [50, 90, 150],
    range: [10, 12, 14],
    fireRate: [2.5, 2.2, 1.8],
    color: [0xaa44aa, 0xbb55bb, 0xcc66cc],
    emissive: [0x220a22, 0x330d33, 0x441144],
    projectileSpeed: 50,
  },
}

export const ENEMY = {
  TYPES: {
    NORMAL: 'normal',
    FAST: 'fast',
    TANK: 'tank',
    FLYING: 'flying',
    BOSS: 'boss',
  },
}

export const ENEMY_STATS = {
  [ENEMY.TYPES.NORMAL]: {
    name: '普通兵',
    baseHp: 80,
    speed: 3,
    reward: 10,
    size: 0.4,
    color: 0xcc4444,
    emissive: 0x441111,
    flying: false,
  },
  [ENEMY.TYPES.FAST]: {
    name: '快速兵',
    baseHp: 40,
    speed: 6,
    reward: 12,
    size: 0.3,
    color: 0xffaa33,
    emissive: 0x442200,
    flying: false,
  },
  [ENEMY.TYPES.TANK]: {
    name: '重装兵',
    baseHp: 250,
    speed: 1.8,
    reward: 25,
    size: 0.6,
    color: 0x997744,
    emissive: 0x221100,
    flying: false,
  },
  [ENEMY.TYPES.FLYING]: {
    name: '飞行兵',
    baseHp: 60,
    speed: 4,
    reward: 15,
    size: 0.35,
    color: 0x44bbdd,
    emissive: 0x0a2233,
    flying: true,
    flyHeight: 2,
  },
  [ENEMY.TYPES.BOSS]: {
    name: 'BOSS',
    baseHp: 1000,
    speed: 1.5,
    reward: 100,
    size: 0.9,
    color: 0xaa2233,
    emissive: 0x440011,
    flying: false,
  },
}

export const COLOR = {
  // Terrain
  GROUND: 0x2a4a28,
  GROUND_DARK: 0x1e3a1c,
  PATH: 0x6b5a48,
  PATH_EDGE: 0x4a3a28,
  PATH_CENTER: 0x7a6a55,
  GRID_LINE: 0x3a5a32,
  GRID_HIGHLIGHT: 0x88ff88,
  RANGE_CIRCLE: 0x44ff88,
  RANGE_CIRCLE_INVALID: 0xff4444,

  // Markers
  BASE: 0x4488cc,
  BASE_EMISSIVE: 0x112244,
  SPAWN: 0xcc4444,
  SPAWN_EMISSIVE: 0x441111,

  // HP Bar
  HP_BAR_BG: 0x222222,
  HP_BAR_FG: 0x33dd55,
  HP_BAR_LOW: 0xdd3333,
  HP_BAR_BORDER: 0x111111,

  // Environment
  SKY: 0x0f1e2e,
  FOG: 0x0f1e2e,
  AMBIENT_GROUND: 0x112211,
  AMBIENT_SKY: 0x0a1020,
  ENV_GROUND: 0x1e3a25,
  HILL_COLOR: 0x1a3318,
  HILL_COLOR_FAR: 0x163016,
  PARTICLE_COLOR: 0x66ffaa,

  // Tower base material
  TOWER_BASE: 0x555550,
  TOWER_BASE_DARK: 0x3a3a38,
  METAL_DARK: 0x333338,
  METAL_LIGHT: 0x888890,
}

// Path waypoints in grid coordinates
export const MAP_PATH = [
  { x: -1, z: 2 },
  { x: 5, z: 2 },
  { x: 5, z: 7 },
  { x: 14, z: 7 },
  { x: 14, z: 2 },
  { x: 19, z: 2 },
  { x: 19, z: 11 },
  { x: 10, z: 11 },
  { x: 10, z: 5 },
  { x: 3, z: 5 },
  { x: 3, z: 11 },
  { x: -1, z: 11 },
]
