import { formatPercent } from "../utils.js";

export const updateHud = ({ player, overlay }) => {
  const energyFill = overlay.querySelector("#energyFill");
  const xpFill = overlay.querySelector("#xpFill");
  const stats = overlay.querySelector("#hudStats");

  if (energyFill) {
    energyFill.style.width = formatPercent(player.energyPercent);
  }

  if (xpFill) {
    xpFill.style.width = formatPercent(player.xp / 100);
  }

  if (stats) {
    stats.innerHTML = `
      <div>State: ${player.state}</div>
      <div>Level: ${player.level}</div>
      <div>Energy: ${Math.round(player.energy)}</div>
      <div>Cooldown (Dash): ${player.cooldowns.dash.toFixed(2)}s</div>
    `;
  }
};
