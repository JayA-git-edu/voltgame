import { Game } from "./engine/core.js";
import { buildOverlay } from "./engine/ui/overlay.js";
import { bindUi } from "./engine/ui/bindings.js";

const canvas = document.querySelector("#gameCanvas");
const hudPanel = document.querySelector("#hudPanel");
const overlayPanel = document.querySelector("#overlayPanel");

const game = new Game({ canvas, hudPanel, overlayPanel });

bindUi(game, overlayPanel);
buildOverlay(game, overlayPanel);

game.start();
