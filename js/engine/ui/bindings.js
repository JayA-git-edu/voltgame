import { buildOverlay, buildPause, buildSettings, buildMapContent } from "./overlay.js";

export const bindUi = (game, overlayPanel) => {
  const pauseButton = document.querySelector("#togglePause");
  const mapButton = document.querySelector("#toggleMap");
  const settingsButton = document.querySelector("#toggleSettings");

  const toggle = (title, content) => {
    game.toggleOverlay(title, content);
    overlayPanel.hidden = !game.overlayState.visible;
    buildOverlay(game, overlayPanel);
  };

  pauseButton?.addEventListener("click", () => {
    toggle("Paused", buildPause());
  });

  mapButton?.addEventListener("click", () => {
    toggle("World Map", buildMapContent());
  });

  settingsButton?.addEventListener("click", () => {
    toggle("Settings", buildSettings(game.settings.settings));
  });
};
