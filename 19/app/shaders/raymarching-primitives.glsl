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
#pragma glslify: export(roundedBox)

float sphere(vec3 pos, float radius) {
  return length(pos) - radius;
}


#pragma glslify: export(plane)
#pragma glslify: export(box)
#pragma glslify: export(sphere)