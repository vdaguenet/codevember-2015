#pragma glslify: squareFrame = require('glsl-square-frame')
#pragma glslify: getRay = require('glsl-camera-ray')
#pragma glslify: intersectionAB = require('./raymarching/operations/intersection.glsl')
#pragma glslify: sphere = require('./raymarching/primitives/sphere.glsl')
#pragma glslify: plane = require('./raymarching/primitives/plane.glsl')

uniform vec2 resolution;
uniform float time;
uniform vec3 camera;
uniform vec3 target;

//
// Raymarching settings
//
const int RAYMARCHING_ITERATION = 64;
const float RAYMARCHING_MAX_DIST = 50.0;
const float RAYMARCHING_PRECISION = 0.01;

//
// CONSTANTS
//
#define PI                3.14159265
#define NORMAL_EPS        0.002
#define SKY_COLOR         vec3(0., 0., 0.)
#define AMBIENT_LIGHT     vec3(0.6, 0.6, 0.6)
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
  vec3 nPos = position * .35;
  nPos.xy = rotate2D(nPos.xy, sin(time * 0.5));
  nPos.xz = rotate2D(nPos.xz, cos(time * 0.1));
  float noi = max(-0.4, 0.4 - abs( perlin( nPos * sin(nPos.z * 0.8 + nPos.x * 0.6 + time)) ));

  float ds = sphere( position + vec3(0.0, -6.0, 0.0), 5. );
  ds = intersectionAB(ds, noi);
  vec2 sph = vec2( ds );

  float plaD = plane( position );
  vec2 pla = vec2(plaD);

  vec2 res = smin(sph, pla, 0.1);
  res.y = 1.0;
  if (res.x > sph.x - RAYMARCHING_PRECISION) res.y = 0.5;

  return res;
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

float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax )
{
  float res = 1.0;
  float t = mint;
  for( int i=0; i<16; i++ )
  {
    float h = field( ro + rd*t ).x;
    res = min( res, 8.0*h/t );
    t += clamp( h, 0.02, 0.10 );
    if( h<0.001 || t>tmax ) break;
  }

  return clamp( res, 0.0, 1.0 );
}


void main() {
  float lensLength = 1.0;
  vec2 screenPos = squareFrame(resolution);
  vec3 rayDirection = getRay(camera, target, screenPos, lensLength);

  vec2 collision = raymarching(camera, rayDirection);
  float dist = collision.x;
  vec3 p = camera + rayDirection * dist;
  float matID = collision.y;
  vec3 color = SKY_COLOR;
  vec3 mtlDiffuse = getMaterialColor(matID);

  if (dist > -0.5) {
    vec3 lightDir = vec3(-1.0, 1.0, -2.);
    vec3 lightColor = vec3(0.5, 0.5, 0.75);
    vec3 n = computeNormal(p);
    vec3 diffuse = vec3(max(dot(n, lightDir), 0.0));
    diffuse *= softshadow( p, lightDir, 0.02, 2.5 );

    float depth = ( 1. / log( dist ) );
    color = AMBIENT_LIGHT + shading(p, n, rayDirection, lightDir, lightColor, diffuse) * 0.65;

    if (collision.y == 0.5) {
      color = AMBIENT_LIGHT + shading(p, n, rayDirection, lightDir, lightColor, diffuse) * depth * 0.6;
    }
  }
  color = applyFog(color, dist);

  gl_FragColor = vec4(color, 1.0);
}