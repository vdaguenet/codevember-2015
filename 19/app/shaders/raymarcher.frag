uniform vec2 resolution;
uniform float time;

varying vec2 vUv;

//
//
//
const int raymarchingIteration = 64;

//
// Maths
//
vec2 rotate2D(vec2 pos, float angle) {
  mat2 m = mat2(
    cos(angle), sin(angle),
    -sin(angle), cos (angle)
  );

  return m * pos;
}

//
// RAYMARCHING PRIMITIVES
// - from http://iquilezles.org/www/articles/distfunctions/distfunctions.htm
//
//
float plane(vec3 pos) {
  return pos.y;
}

float box(vec3 pos, vec3 size) {
  return length(max(abs(pos) - size, 0.0));
}

float roundedBox(vec3 pos, vec3 size, float radius) {
  return length(max(abs(pos) - size, 0.0)) - radius;
}

float sphere(vec3 pos, float radius) {
  return length(pos) - radius;
}

//
//
//
float map(vec3 pos) {
  float distPlane = plane(pos);

  pos.xz = rotate2D(pos.xz, sin(time * 2.0) * sin(pos.y) * 0.3); // weird
  pos.xz = rotate2D(pos.xz, sin(time * 0.5));
  float distBox = roundedBox(pos - vec3(2.0 * sin(time), 4.0, 0.0), vec3(2.0), 0.8);

  return min(distPlane, distBox);
}

void main() {
  // camera position
  vec3 pos = vec3(0.0, 5.0, -10.0);
  // camera direction
  vec3 dir = normalize(vec3(vUv, 1.0));

  vec3 color = vec3(0.0);

  // RELEASE THE KRAKEN!!!
  for (int i = 0; i < raymarchingIteration; i++) {
    float d = map(pos);
    if (d < 0.01) {
      color = fract(pos * 0.5);
      break;
    }

    pos += d * dir;
  }


  gl_FragColor = vec4(color, 1.0);
}