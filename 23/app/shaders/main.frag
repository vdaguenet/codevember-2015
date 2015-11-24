#pragma glslify: squareFrame = require('glsl-square-frame')
#pragma glslify: getRay = require('glsl-camera-ray')
#pragma glslify: intersectionAB = require('./raymarching/operations/intersection.glsl')
#pragma glslify: substractionAB = require('./raymarching/operations/substraction.glsl')
#pragma glslify: unionAB = require('./raymarching/operations/union.glsl')
#pragma glslify: sphere = require('./raymarching/primitives/sphere.glsl')
#pragma glslify: roundbox = require('./raymarching/primitives/roundbox.glsl')
#pragma glslify: cylinder = require('./raymarching/primitives/cylinder.glsl')

uniform vec2 resolution;
uniform float time;
uniform vec3 camera;
uniform vec3 target;

//
// Raymarching settings
//
const int RAYMARCHING_ITERATION = 64;
const float RAYMARCHING_MAX_DIST = 50.0;
const float RAYMARCHING_PRECISION = 0.02;

//
// CONSTANTS
//
#define PI                3.14159265
#define NORMAL_EPS        0.002
#define SKY_COLOR         vec3(0., 0., 0.)
// MATERIALS
#define MTL_OBJ1_ID       0.5
#define MTL_OBJ1_COLOR    vec3(1.0, 1.0, 0.0)

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

//http://www.pouet.net/topic.php?post=367360
const vec3 pa = vec3(1., 57., 21.);
const vec4 pb = vec4(0., 57., 21., 78.);
float perlin(vec3 p ) {
  vec3 i = floor(p);
  vec4 a = dot( i, pa ) + pb;
  vec3 f = cos((p-i)*acos(-1.))*(-.5)+.5;
  a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
  a.xy = mix(a.xz, a.yw, f.y);
  return mix(a.x, a.y, f.z);
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
  float sph = sphere( position, 5. );
  float cyl = cylinder( position, vec2(10.,8.) );

  vec3 nPos = position * .45;
  nPos.xy = rotate2D(nPos.xy, time * 0.05);
  nPos.xz = rotate2D(nPos.xz, time * 0.001);
  float noi = max(-0.5, .5 - abs( perlin( nPos.xzy * sin(nPos.z * 0.25 + time * 0.1) ) ));

  float fx = intersectionAB(smin( vec2(sph), vec2(cyl), .99 ).x, noi);
  float fy = intersectionAB(smin( vec2(sph), vec2(cyl), .99 ).y, noi);

  return vec2(fx, fy);
}

//
// RELEASE THE KRAKEN
//
vec2 raymarching(vec3 origin, vec3 dir) {
  float dist = 0.0;
  float materialId = -1.0;
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
  vec3 col = vec3(1.0, 1.0, 1.0);

  if (matID == MTL_OBJ1_ID) {
    col = MTL_OBJ1_COLOR;
  }

  return col;
}

vec3 computeNormal(vec3 pos) {
  vec2 eps = vec2(NORMAL_EPS, 0.0);

  return normalize(vec3(
    field(pos + eps.xyy).x - field(pos - eps.xyy).x,
    field(pos + eps.yxy).x - field(pos - eps.yxy).x,
    field(pos + eps.yyx).x - field(pos - eps.yyx).x
  ));
}

vec3 applyFog(vec3 col, float dist) {
  return mix(col, SKY_COLOR, 1.0 - exp(-0.0015*dist*dist));
}

vec3 rimlight( vec3 pos, vec3 nor )
{
    vec3 v = normalize(-pos);
    float vdn = 1.0 - max(dot(v, nor), 0.0);
    return vec3( smoothstep(0., 1.0, vdn) );
}

// https://github.com/nicoptere/raymarching-for-THREE/blob/master/glsl/halibut.glsl#L171-L187
vec3 shading( vec3 pos, vec3 norm, vec3 rd, vec3 lightDir, vec3 lightColour, vec3 diffuse )
{
  float specularHardness = 128.;
  float specular = 4.;
  float ambientFactor = 0.0005;

  vec3 light = lightColour * max(0.0, dot(norm, lightDir));
  vec3 heading = normalize(-rd + lightDir);
  float spec = pow(max(0.0, dot( heading, norm )), specularHardness) * specular;
  light = (diffuse * light) + ( spec * lightColour);

  return light;
}


void main() {
  float lensLength = 3.0;
  vec2 screenPos = squareFrame(resolution);
  vec3 rayDirection = getRay(camera, target, screenPos, lensLength);

  vec2 collision = raymarching(camera, rayDirection);
  float dist = collision.x;
  vec3 p = camera + rayDirection * dist;
  float matID = collision.y;
  vec3 color = SKY_COLOR;
  vec3 mtlDiffuse = getMaterialColor(matID);

  if (dist > -0.5) {
    vec3 lightDir = normalize(camera) + vec3(-0.5, 0.75, -0.5);
    vec3 lightColor = vec3(0.0, 0.8, 1.0);
    vec3 n = computeNormal(p);
    float diffuse = max(dot(n, lightDir), 0.0);
    float depth = ( 1. / log( dist ) );
    color = shading(p, n, rayDirection, lightDir, lightColor, vec3(diffuse)) * rimlight(p, n) * 1.5 * depth;
  }
  // color = applyFog(color, dist);

  gl_FragColor = vec4(color, 1.0);
}