export class Enemy {
  constructor(position) {
    this.position = { ...position };
    this.size = 28;
    this.state = "patrol";
    this.health = 3;
    this.stunTimer = 0;
    this.direction = 1;
  }

  update(delta, player) {
    if (this.stunTimer > 0) {
      this.stunTimer -= delta;
      this.state = "stunned";
      return;
    }

    const distance = player.position.x - this.position.x;
    if (Math.abs(distance) < 140) {
      this.state = "chase";
      this.position.x += Math.sign(distance) * delta * 50;
    } else {
      this.state = "patrol";
      this.position.x += this.direction * delta * 30;
    }

    if (this.position.x > 520 || this.position.x < 120) {
      this.direction *= -1;
    }
  }

  hit() {
    this.health -= 1;
    this.stunTimer = 0.2;
    return this.health <= 0;
  }
}
