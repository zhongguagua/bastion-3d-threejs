// ==========================================
// Tower Defense Game - Wave Data
// ==========================================

import { ENEMY } from '../core/Constants'

const { NORMAL, FAST, TANK, FLYING, BOSS } = ENEMY.TYPES

export const WAVES = [
  // Wave 1 - Easy intro
  {
    enemies: [
      { type: NORMAL, count: 5, interval: 1.5 },
    ],
    bonus: 15,
  },
  // Wave 2
  {
    enemies: [
      { type: NORMAL, count: 8, interval: 1.2 },
    ],
    bonus: 20,
  },
  // Wave 3 - Introduce fast
  {
    enemies: [
      { type: NORMAL, count: 6, interval: 1.2 },
      { type: FAST, count: 3, interval: 0.8 },
    ],
    bonus: 20,
  },
  // Wave 4
  {
    enemies: [
      { type: FAST, count: 8, interval: 0.6 },
    ],
    bonus: 25,
  },
  // Wave 5 - Introduce tank
  {
    enemies: [
      { type: NORMAL, count: 8, interval: 1.0 },
      { type: TANK, count: 2, interval: 3.0 },
    ],
    bonus: 25,
  },
  // Wave 6
  {
    enemies: [
      { type: FAST, count: 6, interval: 0.7 },
      { type: TANK, count: 3, interval: 2.5 },
    ],
    bonus: 30,
  },
  // Wave 7 - Introduce flying
  {
    enemies: [
      { type: NORMAL, count: 10, interval: 0.8 },
      { type: FLYING, count: 4, interval: 1.0 },
    ],
    bonus: 30,
  },
  // Wave 8
  {
    enemies: [
      { type: FAST, count: 10, interval: 0.5 },
      { type: FLYING, count: 5, interval: 0.8 },
    ],
    bonus: 35,
  },
  // Wave 9
  {
    enemies: [
      { type: TANK, count: 5, interval: 2.0 },
      { type: NORMAL, count: 10, interval: 0.6 },
    ],
    bonus: 35,
  },
  // Wave 10 - Mini boss
  {
    enemies: [
      { type: NORMAL, count: 8, interval: 0.8 },
      { type: TANK, count: 3, interval: 2.0 },
      { type: BOSS, count: 1, interval: 0 },
    ],
    bonus: 50,
  },
  // Wave 11
  {
    enemies: [
      { type: FAST, count: 15, interval: 0.4 },
      { type: FLYING, count: 8, interval: 0.6 },
    ],
    bonus: 40,
  },
  // Wave 12
  {
    enemies: [
      { type: TANK, count: 6, interval: 1.5 },
      { type: FAST, count: 10, interval: 0.5 },
    ],
    bonus: 40,
  },
  // Wave 13
  {
    enemies: [
      { type: NORMAL, count: 15, interval: 0.5 },
      { type: FLYING, count: 8, interval: 0.5 },
      { type: TANK, count: 3, interval: 2.0 },
    ],
    bonus: 45,
  },
  // Wave 14
  {
    enemies: [
      { type: FAST, count: 20, interval: 0.3 },
      { type: TANK, count: 5, interval: 1.5 },
    ],
    bonus: 45,
  },
  // Wave 15 - Boss wave
  {
    enemies: [
      { type: TANK, count: 5, interval: 1.5 },
      { type: FLYING, count: 8, interval: 0.6 },
      { type: BOSS, count: 2, interval: 5.0 },
    ],
    bonus: 60,
  },
  // Wave 16
  {
    enemies: [
      { type: NORMAL, count: 20, interval: 0.3 },
      { type: FAST, count: 15, interval: 0.3 },
    ],
    bonus: 50,
  },
  // Wave 17
  {
    enemies: [
      { type: TANK, count: 8, interval: 1.2 },
      { type: FLYING, count: 12, interval: 0.4 },
    ],
    bonus: 55,
  },
  // Wave 18
  {
    enemies: [
      { type: FAST, count: 20, interval: 0.25 },
      { type: TANK, count: 6, interval: 1.0 },
      { type: FLYING, count: 10, interval: 0.4 },
    ],
    bonus: 55,
  },
  // Wave 19
  {
    enemies: [
      { type: TANK, count: 10, interval: 1.0 },
      { type: BOSS, count: 3, interval: 4.0 },
    ],
    bonus: 60,
  },
  // Wave 20 - Final boss wave
  {
    enemies: [
      { type: NORMAL, count: 15, interval: 0.3 },
      { type: FAST, count: 15, interval: 0.25 },
      { type: TANK, count: 8, interval: 1.0 },
      { type: FLYING, count: 10, interval: 0.4 },
      { type: BOSS, count: 3, interval: 5.0 },
    ],
    bonus: 100,
  },
]

export default WAVES
