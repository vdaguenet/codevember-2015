uniform float time;
uniform float resolution;

varying vec2 vUv;

void main() {
  vUv = position.xy / resolution;

  float displacement = sin( (position.x + time) * 0.3 ) * 2.0 +
                        sin( (position.y + time) * 0.2 ) * 2.0;

  vec3 newPosition = position;
  newPosition.z = displacement;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
}