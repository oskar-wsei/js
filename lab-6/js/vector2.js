export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  copy(other) {
    this.x = other.x;
    this.y = other.y;
    return this;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  add(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  addScalar(scalar) {
    this.x += scalar;
    this.y += scalar;
    return this;
  }

  subtract(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  subtractScalar(scalar) {
    this.x -= scalar;
    this.y -= scalar;
    return this;
  }

  multiply(other) {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  multiplyScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  distanceSquared(other) {
    return (this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y);
  }

  distance(other) {
    return Math.sqrt(this.distanceSquared(other));
  }

  lengthSquared() {
    return this.x ** 2 + this.y ** 2;
  }

  length() {
    return Math.sqrt(this.lengthSquared());
  }
}
