import { GAME_CONFIG } from "./constants.js";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
  }

  clear() {
    this.ctx.fillStyle = "#0b1120";
    this.ctx.fillRect(0, 0, GAME_CONFIG.width, GAME_CONFIG.height);
  }

  drawGround() {
    const { ctx } = this;
    ctx.fillStyle = "#14213d";
    ctx.fillRect(0, GAME_CONFIG.height - 48, GAME_CONFIG.width, 48);
    ctx.fillStyle = "#1f2a44";
    ctx.fillRect(0, GAME_CONFIG.height - 52, GAME_CONFIG.width, 4);
  }

  drawPlayer(player) {
    const { ctx } = this;
    const size = player.size;
    ctx.save();
    ctx.translate(player.position.x, player.position.y);
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(-size / 2, -size / 2, size, size);
    ctx.strokeStyle = player.energyGlow;
    ctx.lineWidth = 3;
    ctx.strokeRect(-size / 2 + 1.5, -size / 2 + 1.5, size - 3, size - 3);
    ctx.restore();
  }

  drawEnemy(enemy) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(enemy.position.x, enemy.position.y);
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(-enemy.size / 2, -enemy.size / 2, enemy.size, enemy.size);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.strokeRect(-enemy.size / 2 + 1, -enemy.size / 2 + 1, enemy.size - 2, enemy.size - 2);
    ctx.restore();
  }

  drawProjectile(projectile) {
    const { ctx } = this;
    ctx.save();
    ctx.translate(projectile.position.x, projectile.position.y);
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(0, 0, projectile.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawDamageNumbers(numbers) {
    const { ctx } = this;
    ctx.font = "12px monospace";
    ctx.fillStyle = "#f87171";
    numbers.forEach((number) => {
      ctx.fillText(number.text, number.position.x, number.position.y);
    });
  }
}
