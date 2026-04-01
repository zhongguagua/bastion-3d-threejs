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
  INITIAL_POS: { x: 20, y: 35, z: 30 },
  LOOK_AT: { x: 20, y: 0, z: 14 },
  FOV: 50,
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
    color: [0x44aa44, 0x55cc55, 0x66ee66],
    projectileSpeed: 25,
  },
  [TOWER.TYPES.CANNON]: {
    name: '炮塔',
    description: '范围伤害，攻速慢',
    cost: [100, 150, 220],
    damage: [25, 45, 70],
    range: [5, 5.5, 6],
    fireRate: [1.5, 1.3, 1.0],
    color: [0xcc6633, 0xdd7744, 0xee8855],
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
    color: [0x4488cc, 0x55aadd, 0x66ccee],
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
    color: [0xaaaa44, 0xcccc55, 0xeeee66],
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
    color: [0x884488, 0x995599, 0xaa66aa],
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
    color: 0xcc3333,
    flying: false,
  },
  [ENEMY.TYPES.FAST]: {
    name: '快速兵',
    baseHp: 40,
    speed: 6,
    reward: 12,
    size: 0.3,
    color: 0xffaa33,
    flying: false,
  },
  [ENEMY.TYPES.TANK]: {
    name: '重装兵',
    baseHp: 250,
    speed: 1.8,
    reward: 25,
    size: 0.6,
    color: 0x885533,
    flying: false,
  },
  [ENEMY.TYPES.FLYING]: {
    name: '飞行兵',
    baseHp: 60,
    speed: 4,
    reward: 15,
    size: 0.35,
    color: 0x33aacc,
    flying: true,
    flyHeight: 2,
  },
  [ENEMY.TYPES.BOSS]: {
    name: 'BOSS',
    baseHp: 1000,
    speed: 1.5,
    reward: 100,
    size: 0.9,
    color: 0x882222,
    flying: false,
  },
}

export const COLOR = {
  GROUND: 0x2d5a1e,
  PATH: 0x8b7355,
  PATH_EDGE: 0x6b5335,
  GRID_LINE: 0x3a6a2a,
  GRID_HIGHLIGHT: 0x88ff88,
  RANGE_CIRCLE: 0x44ff44,
  RANGE_CIRCLE_INVALID: 0xff4444,
  BASE: 0x4466aa,
  SPAWN: 0xaa4444,
  HP_BAR_BG: 0x333333,
  HP_BAR_FG: 0x44cc44,
  HP_BAR_LOW: 0xcc4444,
  SKY: 0x1a2a3a,
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
