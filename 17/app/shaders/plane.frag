uniform float time;

varying vec2 vUv;

void main() {

  vec3 step = vec3(smoothstep(0.5, 0.56, fract(vUv.y * 10.0)));
  vec3 color = mix(vec3(0.8, 0.8, 0.77), vec3(0.15, 0.15, 0.15), step);

  gl_FragColor = vec4( color, 1.0 );
}