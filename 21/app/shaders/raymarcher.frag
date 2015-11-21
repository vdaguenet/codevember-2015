uniform vec2 resolution;
uniform float time;

varying vec2 vUv;


//
// CONSTANTS
//
#define PI                3.14159265
#define NORMAL_EPS        0.001
// Materials
#define MTL_BG            -1.0
#define MTL_BG_COLOR      vec3(0.0, 0.0, 0.0)
#define MTL_OBJ1          1.0
#define MTL_OBJ1_COLOR    vec3(1.0, 0.0, 0.0)
#define MTL_OBJ2          2.0
#define MTL_OBJ2_COLOR    vec3(0.0, 1.0, 0.0)
#define MTL_OBJ3          3.0
#define MTL_OBJ3_COLOR    vec3(0.0, 0.0, 1.0)

//
// Raymarching settings
//
const int RAYMARCHING_ITERATION = 50;
const float RAYMARCHING_MAX_DIST = 30.0;
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

vec3 translate(vec3 pos, vec3 dir) {
  return pos - dir;
}

//http://iquilezles.org/www/articles/smin/smin.htm
vec2 smin( vec2 a, vec2 b, float k ) {
  float h = clamp( 0.5+0.5*(b.x-a.x)/k, 0.0, 1.0 );
  return vec2( mix( b.x, a.x, h ) - k*h*(1.0-h), 1. );
}

float repeat(float coord, float spacing) {
  return mod(coord, spacing) - spacing*0.5;
}

vec2 repeatAng(vec2 p, float n) {
  float ang = 2.0*PI/n;
  float sector = floor(atan(p.x, p.y)/ang + 0.5);
  p = rotate2D(p, sector*ang);
  return p;
}

//
// Boolean operations
//
vec2 unionAB(vec2 a, vec2 b){return vec2(min(a.x, b.x),1.);}
vec2 intersectionAB(vec2 a, vec2 b){return vec2(max(a.x, b.x),1.);}
vec2 diffAB(vec2 a, vec2 b){ return vec2(max(-a.x, b.x),1.); }

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

float torus(vec3 pos, float ri, float ro) {
  vec2 q = vec2(length(pos.xz) - ri, pos.y);
  return length(q) - ro;
}

float cylinder( vec3 pos, vec2 h ) {
  vec2 d = abs(vec2(length(pos.xz),pos.y)) - h;
  return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}

float cone( in vec3 p, in vec3 c ) {
    vec2 q = vec2( length(p.xz), p.y );
    float d1 = -q.y-c.z;
    float d2 = max( dot(q,c.xy), q.y);
    return length(max(vec2(d1,d2),0.0)) + min(max(d1,d2), 0.);
}

//
// Funny functions
// - http://blog.ruslans.com/2015/01/raymarching-christmas-tree.html
//
float wigglies(vec3 p) {
  return cos(p.y*40.0)*0.02;
}

float bumps(vec3 p) {
  return cos(atan(p.x, p.z)*30.0)*0.01*(0.5 - p.y) + sin(p.y*60.0)*0.01;
}

//
// Build stuffs
//
vec2 field(vec3 position) {
  // ground of balls
  // pos.x = repeat(pos.x, 1.0);
  // pos.z = repeat(pos.z, 1.0);
  vec3 p = position;
  vec3 p1 = p + vec3(4.0, 0.0, 0.0);
  vec2 obj1 = vec2(sphere(p1, 1.0));

  vec3 p2 = p + vec3(-4.0, 0.0, 0.0);
  vec2 obj2 = vec2(sphere(p2, 1.0));

  vec3 p3 = p + vec3(0.0, -4.0, 0.0);
  vec2 obj3 = vec2(sphere(p3, 1.0));
  // pos = translate(pos, vec3(0.0, -3.0, 0.0));

  vec2 res = smin(obj1, obj2, 0.1);
  res = smin(res, obj3, 0.1);

  // apply material colors
  if (res.x > obj1.x - RAYMARCHING_PRECISION) res.y = MTL_OBJ1;
  if (res.x > obj2.x - RAYMARCHING_PRECISION) res.y = MTL_OBJ2;
  if (res.x > obj3.x - RAYMARCHING_PRECISION) res.y = MTL_OBJ3;

  return res;
}

//
// RELEASE THE KRAKEN
//
vec2 raymarching(vec3 origin, vec3 dir) {
  float dist = 0.0;
  float materialId = MTL_BG;
  vec2 res = vec2(-1.0, materialId);

  for (int i = 0; i < RAYMARCHING_ITERATION; i++) {
      vec2 f = field(origin + dir * dist);
      float d = f.x;

      if (d < RAYMARCHING_PRECISION || dist > RAYMARCHING_MAX_DIST) break;

      materialId = f.y;
      dist += d;
  }

  if (dist < RAYMARCHING_MAX_DIST) {
    res = vec2(dist, materialId);
  }

  return res;
}

//
// RENDERING
//
vec3 getMaterialColor(float matID) {
    vec3 col = MTL_BG_COLOR;

    if (matID <= MTL_OBJ1) {
      col = MTL_OBJ1_COLOR;
    } else if (matID <= MTL_OBJ2) {
      col = MTL_OBJ2_COLOR;
    } else if (matID <= MTL_OBJ3) {
      col = MTL_OBJ3_COLOR;
    }


    return col;
}

// https://www.youtube.com/watch?v=s6t0mJsgUKw
vec3 computeNormal(vec3 pos) {
  vec2 eps = vec2(NORMAL_EPS, 0.0);

  return normalize(vec3(
    field(pos + eps.xyy).x - field(pos - eps.xyy).x,
    field(pos + eps.yxy).x - field(pos - eps.yxy).x,
    field(pos + eps.yyx).x - field(pos - eps.yyx).x
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

vec3 applyFog(vec3 col, float dist) {
    return mix(col, MTL_BG_COLOR, 1.0 - exp(-0.0015*dist*dist));
}

vec3 render(vec3 rayOrig, vec3 rayDir) {
  vec2 collision = raymarching(rayOrig, rayDir);
  vec3 pos = rayOrig + rayDir * collision.x;
  float dist = collision.x;
  float matID = collision.y;
  vec3 color = MTL_BG_COLOR;

  vec3 lightDirection = normalize(vec3(1.0, 0.6, 0.2));
  vec3 lightColor = vec3(0.9, 0.9, 0.8);

  vec3 normal = computeNormal(pos);
  float diff = diffuse(normal, lightDirection);
  float spec = specular(normal, rayDir);

  if (dist > -0.5) {
    color = (diff + spec) * lightColor * getMaterialColor(matID);
  }
  color = applyFog(color, dist);


  return color;
}

void main() {
  vec3 rayOrigin = vec3(0.0, 4.0, -10.0);
  vec3 rayDirection = normalize(vec3(vUv, 1.0));

  vec3 color = render(rayOrigin, rayDirection);

  gl_FragColor = vec4(color, 1.0);
}