export class InputManager {
  constructor(keybinds) {
    this.keybinds = keybinds;
    this.state = new Map();
    this.handlers = {
      keydown: (event) => this.setKey(event.code, true),
      keyup: (event) => this.setKey(event.code, false),
      blur: () => this.reset(),
    };
  }

  connect() {
    window.addEventListener("keydown", this.handlers.keydown);
    window.addEventListener("keyup", this.handlers.keyup);
    window.addEventListener("blur", this.handlers.blur);
  }

  disconnect() {
    window.removeEventListener("keydown", this.handlers.keydown);
    window.removeEventListener("keyup", this.handlers.keyup);
    window.removeEventListener("blur", this.handlers.blur);
  }

  setKey(code, pressed) {
    this.state.set(code, pressed);
  }

  reset() {
    this.state.clear();
  }

  isPressed(action) {
    const key = this.keybinds[action];
    if (!key) return false;
    return this.state.get(key) === true;
  }
}
