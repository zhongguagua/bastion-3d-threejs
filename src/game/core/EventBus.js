// ==========================================
// Tower Defense Game - Event Bus
// ==========================================

class EventBus {
  constructor() {
    this._listeners = {}
  }

  on(event, callback) {
    if (!this._listeners[event]) {
      this._listeners[event] = []
    }
    this._listeners[event].push(callback)
    return () => this.off(event, callback)
  }

  off(event, callback) {
    if (!this._listeners[event]) return
    this._listeners[event] = this._listeners[event].filter(cb => cb !== callback)
  }

  emit(event, ...args) {
    if (!this._listeners[event]) return
    this._listeners[event].forEach(cb => {
      try {
        cb(...args)
      } catch (e) {
        console.error(`EventBus error on "${event}":`, e)
      }
    })
  }

  once(event, callback) {
    const wrapper = (...args) => {
      this.off(event, wrapper)
      callback(...args)
    }
    this.on(event, wrapper)
    return () => this.off(event, wrapper)
  }

  clear() {
    this._listeners = {}
  }
}

export default EventBus
