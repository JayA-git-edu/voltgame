import { clamp } from "../utils.js";
import { GAME_CONFIG } from "../constants.js";

export class Player {
  constructor() {
    this.size = 32;
    this.position = { x: 160, y: 220 };
    this.velocity = { x: 0, y: 0 };
    this.energy = GAME_CONFIG.energyMax;
    this.xp = 0;
    this.level = 1;
    this.state = "idle";
    this.facing = 1;
    this.onGround = false;
    this.cooldowns = {
      dash: 0,
      blast: 0,
    };
  }

  get energyPercent() {
    return this.energy / GAME_CONFIG.energyMax;
  }

  get energyGlow() {
    const intensity = Math.round(200 * this.energyPercent + 55);
    return `rgb(${intensity}, ${200 - intensity / 2}, 255)`;
  }

  update(delta, input) {
    const speed = 2.2;
    const jumpForce = -7.5;
    const dashSpeed = 6;

    this.velocity.x = 0;

    if (input.isPressed("left")) {
      this.velocity.x = -speed;
      this.facing = -1;
    }
    if (input.isPressed("right")) {
      this.velocity.x = speed;
      this.facing = 1;
    }

    if (input.isPressed("jump") && this.onGround) {
      this.velocity.y = jumpForce;
      this.onGround = false;
    }

    const wantsDash = input.isPressed("dash");
    if (wantsDash && this.energy >= GAME_CONFIG.dashCost && this.cooldowns.dash <= 0) {
      this.energy -= GAME_CONFIG.dashCost;
      this.velocity.x = dashSpeed * this.facing;
      this.cooldowns.dash = 0.35;
      this.state = "dash";
    }

    if (input.isPressed("charge")) {
      this.energy = clamp(this.energy + GAME_CONFIG.energyRegen * delta * 1.8, 0, GAME_CONFIG.energyMax);
      this.state = "charge";
    }

    if (input.isPressed("attack")) {
      this.state = "attack";
    }

    if (!this.onGround) {
      this.velocity.y += GAME_CONFIG.gravity;
    }

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    const ground = GAME_CONFIG.height - 64;
    if (this.position.y >= ground) {
      this.position.y = ground;
      this.velocity.y = 0;
      this.onGround = true;
    }

    this.position.x = clamp(this.position.x, 32, GAME_CONFIG.width - 32);

    this.cooldowns.dash = Math.max(0, this.cooldowns.dash - delta);
    this.cooldowns.blast = Math.max(0, this.cooldowns.blast - delta);

    if (!input.isPressed("charge") && this.state === "charge") {
      this.state = "idle";
    }
  }

  canBlast() {
    return this.energy >= GAME_CONFIG.blastCost && this.cooldowns.blast <= 0;
  }

  consumeBlast() {
    this.energy = clamp(this.energy - GAME_CONFIG.blastCost, 0, GAME_CONFIG.energyMax);
    this.cooldowns.blast = 0.25;
  }

  gainXp(amount) {
    this.xp += amount;
    if (this.xp >= 100) {
      this.level += 1;
      this.xp = 0;
    }
  }
}
