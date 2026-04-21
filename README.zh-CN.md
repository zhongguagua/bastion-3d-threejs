[English](./README.md)

# 城堡防御 - 3D 塔防游戏

一款基于 **Vue 2** 和 **Three.js** 构建的 3D 塔防游戏。玩家通过策略性地放置和升级防御塔，在 3D 战场上击退一波又一波的敌人。游戏采用赛博朋克风格的 UI，带有毛玻璃效果和沉浸式 3D 渲染。

## 功能特性

- **5 种独特防御塔** - 每种拥有不同的攻击机制，支持 3 级升级：
  - **箭塔** - 高速单体攻击
  - **炮塔** - 范围溅射伤害
  - **冰塔** - 减缓敌人移动速度
  - **闪电塔** - 链式闪电，可攻击多个目标
  - **狙击塔** - 远程高伤害单体攻击

- **5 种敌人类型**，难度逐步递增：
  - **士兵** - 标准地面单位
  - **侦察兵** - 速度快但血量低
  - **坦克** - 高血量，移动缓慢
  - **飞行兵** - 空中单位，在地面之上移动
  - **Boss** - 巨额血量，在后期波次出现

- **20 波**逐渐增加难度的敌人，每波 HP 递增，第 10、15、20 波出现 Boss

- **全 3D 战场**，由 Three.js 驱动 - 地形、环境装饰、粒子特效和弹射物动画

- **策略经济系统** - 通过击杀敌人获取金币，合理分配资源用于建造、升级和出售防御塔（出售返还 60%）

- **摄像机控制** - 轨道旋转、缩放，获得最佳战术视角

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Vue 2 |
| 3D 渲染 | Three.js |
| 构建工具 | Vue CLI 5 |
| 部署 | Vercel |

## 项目结构

```
src/
  game/
    core/          # GameEngine, EventBus, ObjectPool, Constants
    map/           # GameMap, Grid, Path
    towers/        # Tower 基类, ArrowTower, CannonTower, IceTower, LightningTower, SniperTower, TowerFactory
    enemies/       # Enemy 基类, NormalEnemy, FastEnemy, TankEnemy, FlyingEnemy, BossEnemy, EnemyFactory
    projectiles/   # Projectile, Arrow, Cannonball, IceShard, Lightning, SniperBullet
    effects/       # EffectManager, Explosion, Particle, Aura
    wave/          # WaveManager, WaveData (20 波定义)
    ui/            # SceneRenderer, InputHandler
  components/
    TowerDefense.vue  # 主游戏组件
    HUD.vue           # 游戏内 HUD
    TowerPanel.vue    # 防御塔选择/升级面板
    StartScreen.vue   # 开始界面
    GameOverScreen.vue# 游戏结束/胜利界面
  App.vue             # 根组件
```

## 快速开始

### 环境要求

- Node.js >= 14
- npm >= 6

### 安装

```bash
npm install
```

### 开发

```bash
npm run serve
```

### 生产构建

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

## 操作说明

| 操作 | 功能 |
|------|------|
| 左键点击（网格） | 放置防御塔 / 选择已有防御塔 |
| 右键点击 | 取消放置 |
| ESC | 暂停 / 继续 |
| 鼠标拖拽 | 旋转摄像机 |
| 滚轮 | 缩放镜头 |

- 初始拥有 **250 金币** 和 **20 点生命值**
- 从侧边面板选择防御塔类型，然后点击绿色高亮的网格格子进行放置
- 点击已有的防御塔可以查看攻击范围、升级或出售
- 成功抵御全部 20 波敌人即可获胜
