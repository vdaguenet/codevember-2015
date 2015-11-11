export function normalize(value, min, max) {
  return (value - min) / (max - min);
}

export function lerp(norm, min, max) {
  return (max - min) * norm + min;
}

export function map(value, sourceMin, sourceMax, destMin, destMax) {
  return lerp(normalize(value, sourceMin, sourceMax), destMin, destMax);
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, Math.min(min, max)), Math.max(min, max));
}

export function distance(x0, y0, x1, y1) {
  const dx = x1 - x0;
  const dy = y1 - y0;

  return Math.sqrt(dx * dx + dy * dy);
}

export function inRange(value, min, max) {
  return value >= Math.min(min, max) && value <= Math.max(min, max);
}

export function degreesToRads(degrees) {
  return degrees / 180 * Math.PI;
}

export function radsToDegrees(radians) {
  return radians * 180 / Math.PI;
}

export function randomRange(min, max) {
  return min + Math.random() * (max - min);
}
