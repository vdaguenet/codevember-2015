uniform vec2 resolution;
varying vec2 vUv;

void main() {
  vUv = position.xy;
  vUv.x *= resolution.x / resolution.y;

  gl_Position =  vec4( position, 1.0 );
}