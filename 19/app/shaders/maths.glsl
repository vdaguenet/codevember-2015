const float PI = 3.14159265358979323846264;

vec2 rotate2D(vec2 pos, float angle) {
  mat2 m = mat2(
    cos(angle), sin(angle),
    -sin(angle), cos (angle)
  );

  return m * pos;
}

#pragma glslify: export(PI)
#pragma glslify: export(rotate2D)
