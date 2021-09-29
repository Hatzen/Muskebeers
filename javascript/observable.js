export default class Observable {
  constructor() {
    this.events = {}
  }

  on(key, method) {
    if(this.events[key])
      this.events[key].push(method)
    else
      this.events[key] = [method]
  }

  emit(key, payload) {
    if(this.events[key])
      this.events[key].map((method) => method(payload))
  }
}
