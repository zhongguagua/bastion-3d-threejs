// ==========================================
// Tower Defense Game - Object Pool
// ==========================================

class ObjectPool {
  constructor(createFn, resetFn, initialSize = 20) {
    this._createFn = createFn
    this._resetFn = resetFn
    this._pool = []
    this._active = []

    for (let i = 0; i < initialSize; i++) {
      this._pool.push(this._createFn())
    }
  }

  acquire(...args) {
    let obj
    if (this._pool.length > 0) {
      obj = this._pool.pop()
    } else {
      obj = this._createFn()
    }
    this._resetFn(obj, ...args)
    this._active.push(obj)
    return obj
  }

  release(obj) {
    const index = this._active.indexOf(obj)
    if (index !== -1) {
      this._active.splice(index, 1)
      this._pool.push(obj)
    }
  }

  releaseAll() {
    while (this._active.length > 0) {
      this._pool.push(this._active.pop())
    }
  }

  get active() {
    return this._active
  }

  get activeCount() {
    return this._active.length
  }

  get poolSize() {
    return this._pool.length
  }
}

export default ObjectPool
