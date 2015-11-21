uniform vec2 resolution;
uniform float time;

varying vec2 vUv;

//
// Raymarching settings
//
const int RAYMARCHING_ITERATION = 64;
const float RAYMARCHING_MAX_DIST = 300.0;
const float RAYMARCHING_PRECISION = 0.01;

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

//http://iquilezles.org/www/articles/smin/smin.htm
vec2 smin( vec2 a, vec2 b, float k ) {
  float h = clamp( 0.5+0.5*(b.x-a.x)/k, 0.0, 1.0 );
  return vec2( mix( b.x, a.x, h ) - k*h*(1.0-h), 1. );
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
// Build stuffs
//
float field(vec3 pos) {
  float distPlane = plane(pos);

  pos.x = abs(pos.x); // symetry
  pos.xy = rotate2D(pos.xy, sin(time * 2.0) * sin(pos.y) * 0.3); // weird
  pos.xy = rotate2D(pos.xy, sin(time * 1.0));
  pos.zx = rotate2D(pos.zx, cos(time * 0.8) - sin(pos.x + time) * 0.3);
  // pos.xy = rotate2D(pos.xy, sin(time * 0.5));
  float distBox = roundedBox(pos - vec3(0.0, 5.0, 0.0), vec3(3.2), 0.8);

  // return smin(vec2(distPlane), vec2(distBox), 0.1).x;
  return distBox;
}

//
// RELEASE THE KRAKEN
//
vec3 raymarching(vec3 pos, vec3 dir, float maxd, float rayPrecision) {
  float dist = 0.0;
  vec3 result = vec3(-1.0);

  for (int i = 0; i < RAYMARCHING_ITERATION; i++) {
    if (dist > maxd) break;

    float d = field(pos);

    if (d < rayPrecision) {
      result = pos;
      break;
    }

    pos += d * dir;
    dist += pos.z;
  }

  return result;
}

//
// RENDERING
//
vec3 albedo(vec3 pos) {
  pos *= 0.5;
  // return fract(pos.x) * fract(pos.z) * vec3(1.0);
  // float f = smoothstep(0.27, 0.3, fract(pos.x + sin(pos.z * sin(time)) * 0.4));
  // return  f * vec3(1.0);
  return vec3(1.0);
}

// https://www.youtube.com/watch?v=s6t0mJsgUKw
vec3 computeNormal(vec3 pos) {
  vec2 eps = vec2(0.01, 0.0);
  return normalize(vec3(
    field(pos + eps.xyy) - field(pos - eps.xyy),
    field(pos + eps.yxy) - field(pos - eps.yxy),
    field(pos + eps.yyx) - field(pos - eps.yyx)
  ));
}

float diffuse(vec3 normal, vec3 lightDirection) {
  // return max(dot(normal, lightDirection), 0.0);
  // wrap lighting
  return dot(normal, lightDirection) * 0.5 + 0.5;
}

float specular(vec3 normal, vec3 dir) {
  vec3 h = normalize(normal - dir);
  return pow(max(dot(h, normal), 0.0), 100.0);
}

vec3 fakeLight(vec3 pos, float intensity, vec3 color) {
  float lightDistance = sphere(pos, 1.0);
  return intensity / (lightDistance * lightDistance) * color;
}

void main() {
  // camera position
  vec3 pos = vec3(0.0, 5.0, -10.0);
  // camera direction
  vec3 dir = normalize(vec3(vUv, 1.0));

  vec3 lightDirection = normalize(vec3(1.0, 0.6, 0.2));

  vec3 p = raymarching(pos, dir, RAYMARCHING_MAX_DIST, RAYMARCHING_PRECISION);

  if (p.y > -1.0) {
    vec3 normal = computeNormal(p);
    float diff = diffuse(normal, lightDirection);
    float spec = specular(normal, dir);

    vec3 color = (diff + spec) * fakeLight(p, 35.0, vec3(0.9, 0.9, 0.8)) * albedo(p);
    // vec3 color = (diff + spec) * vec3(0.9, 0.7, 0.2) * albedo(p);

    gl_FragColor = vec4(color, 1.0);
  } else {
    // sky
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
}