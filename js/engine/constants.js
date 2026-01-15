export const PIXEL_SCALE_OPTIONS = [2, 3, 4, 5];
export const DEFAULT_SETTINGS = {
  pixelScale: 3,
  screenShake: true,
  shaderFx: true,
  lowFxMode: false,
  masterVolume: 0.8,
  musicVolume: 0.6,
  sfxVolume: 0.7,
  keybinds: {
    left: "ArrowLeft",
    right: "ArrowRight",
    jump: "Space",
    dash: "Shift",
    attack: "KeyZ",
    blast: "KeyX",
    charge: "KeyC",
  },
};

export const GAME_CONFIG = {
  width: 640,
  height: 360,
  tileSize: 32,
  gravity: 0.35,
  dashCost: 12,
  blastCost: 8,
  energyRegen: 6,
  energyMax: 100,
};
