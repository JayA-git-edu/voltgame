import { DEFAULT_SETTINGS } from "./constants.js";
import { loadSettings, saveSettings } from "./storage.js";

export class SettingsManager {
  constructor() {
    this.settings = { ...DEFAULT_SETTINGS, ...(loadSettings() ?? {}) };
  }

  update(partial) {
    this.settings = { ...this.settings, ...partial };
    saveSettings(this.settings);
  }

  updateKeybind(action, key) {
    this.settings.keybinds = { ...this.settings.keybinds, [action]: key };
    saveSettings(this.settings);
  }
}
