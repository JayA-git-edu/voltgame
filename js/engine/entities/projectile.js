export class Projectile {
  constructor(position, direction) {
    this.position = { ...position };
    this.velocity = { x: direction * 8, y: 0 };
    this.radius = 4;
    this.active = true;
  }

  update(delta) {
    this.position.x += this.velocity.x * delta * 60;
    if (this.position.x < 0 || this.position.x > 640) {
      this.active = false;
    }
  }
}
