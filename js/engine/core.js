import { Renderer } from "./renderer.js";
import { InputManager } from "./input.js";
import { SettingsManager } from "./settings.js";
import { Player } from "./entities/player.js";
import { Enemy } from "./entities/enemy.js";
import { Projectile } from "./entities/projectile.js";
import { updateHud } from "./ui/hud.js";
import { now } from "./utils.js";

export class Game {
  constructor({ canvas, hudPanel, overlayPanel }) {
    this.renderer = new Renderer(canvas);
    this.settings = new SettingsManager();
    this.input = new InputManager(this.settings.settings.keybinds);
    this.player = new Player();
    this.enemies = [new Enemy({ x: 420, y: 240 })];
    this.projectiles = [];
    this.damageNumbers = [];
    this.hudPanel = hudPanel;
    this.overlayPanel = overlayPanel;
    this.lastTime = now();
    this.running = false;
    this.overlayState = {
      visible: false,
      title: "",
      content: "",
    };
  }

  start() {
    this.input.connect();
    this.running = true;
    requestAnimationFrame(() => this.loop());
  }

  toggleOverlay(title, content) {
    if (this.overlayState.visible && this.overlayState.title === title) {
      this.overlayState = { visible: false, title: "", content: "" };
      return;
    }
    this.overlayState = { visible: true, title, content };
  }

  loop() {
    if (!this.running) return;
    const current = now();
    const delta = Math.min(0.05, (current - this.lastTime) / 1000);
    this.lastTime = current;

    if (!this.overlayState.visible) {
      this.update(delta);
    }
    this.render();
    requestAnimationFrame(() => this.loop());
  }

  update(delta) {
    this.player.update(delta, this.input);

    if (this.input.isPressed("blast") && this.player.canBlast()) {
      this.player.consumeBlast();
      this.projectiles.push(new Projectile(this.player.position, this.player.facing));
    }

    this.enemies.forEach((enemy) => enemy.update(delta, this.player));
    this.projectiles.forEach((projectile) => projectile.update(delta));
    this.projectiles = this.projectiles.filter((projectile) => projectile.active);

    this.handleCollisions();
    this.updateDamageNumbers(delta);

    updateHud({ player: this.player, overlay: this.hudPanel });
  }

  handleCollisions() {
    this.projectiles.forEach((projectile) => {
      this.enemies.forEach((enemy) => {
        const dx = projectile.position.x - enemy.position.x;
        const dy = projectile.position.y - enemy.position.y;
        const distance = Math.hypot(dx, dy);
        if (distance < projectile.radius + enemy.size / 2) {
          projectile.active = false;
          if (enemy.hit()) {
            this.player.gainXp(25);
          }
          this.damageNumbers.push({
            text: "-1",
            position: { x: enemy.position.x, y: enemy.position.y - 12 },
            time: 0.4,
          });
        }
      });
    });
  }

  updateDamageNumbers(delta) {
    this.damageNumbers.forEach((number) => {
      number.position.y -= delta * 24;
      number.time -= delta;
    });
    this.damageNumbers = this.damageNumbers.filter((number) => number.time > 0);
  }

  render() {
    this.renderer.clear();
    this.renderer.drawGround();
    this.renderer.drawPlayer(this.player);
    this.enemies.forEach((enemy) => this.renderer.drawEnemy(enemy));
    this.projectiles.forEach((projectile) => this.renderer.drawProjectile(projectile));
    this.renderer.drawDamageNumbers(this.damageNumbers);
  }
}
