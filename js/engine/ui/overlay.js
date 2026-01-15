import { buildWorldMap } from "../world/worldMap.js";

export const buildOverlay = (game, overlay) => {
  overlay.innerHTML = `
    <h2 class="overlay__title">${game.overlayState.title}</h2>
    ${game.overlayState.content}
  `;
};

export const buildSettings = (settings) => {
  return `
    <div class="overlay__section">
      <h3>Settings</h3>
      <p>Pixel Scale: ${settings.pixelScale}x</p>
      <p>Screen Shake: ${settings.screenShake ? "On" : "Off"}</p>
      <p>Shader FX: ${settings.shaderFx ? "On" : "Off"}</p>
      <p>Low-FX Mode: ${settings.lowFxMode ? "On" : "Off"}</p>
    </div>
  `;
};

export const buildPause = () => {
  return `
    <div class="overlay__section">
      <h3>Pause Menu</h3>
      <p>Resume to continue the fight.</p>
      <p>Use the settings button to tweak accessibility options.</p>
    </div>
  `;
};

export const buildMapContent = () => buildWorldMap();
