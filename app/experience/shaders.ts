// Plane shaders: cover-fit texture, hover darken + zoom, rounded-rect reveal mask,
// blurred back faces, and a vertex bend driven by scroll speed.
export const planeVertex = /* glsl */ `
varying vec2 vUv;
#define PI 3.14159265359
uniform float uScrollSpeed;
void main() {
  vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vec3 p = position;
  p.z = sin(uv.x * PI) * 0.2;
  vec4 viewPosition = viewMatrix * modelMatrix * vec4(p, 1.0);
  viewPosition.x += pow(worldPosition.y, 2.0) * 0.1;
  viewPosition.x += sin(uv.y * PI) * uScrollSpeed * 2.0;
  gl_Position = projectionMatrix * viewPosition;
  vUv = uv;
}`

export const planeFragment = /* glsl */ `
uniform sampler2D uTexture;
uniform float uColorStrength, uZoom, uRevealProgress;
uniform vec2 uPlaneSizes, uImageSizes;
varying vec2 vUv;
float roundedRectSDF(vec2 uv, vec2 size, float radius) {
  vec2 d = abs(uv - 0.5) - size * 0.5 + radius;
  return length(max(d, 0.0)) - radius;
}
void main() {
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0));
  vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
  vec4 color;
  if (gl_FrontFacing) {
    color = mix(texture2D(uTexture, (uv - 0.5) / uZoom + 0.5), vec4(0.0, 0.0, 0.0, 1.0), uColorStrength);
  } else {
    float o = 40.0 / 1024.0;
    vec4 c = texture2D(uTexture, uv) * 4.0;
    c += (texture2D(uTexture, uv + vec2(0.0, -o)) + texture2D(uTexture, uv + vec2(-o, 0.0)) + texture2D(uTexture, uv + vec2(o, 0.0)) + texture2D(uTexture, uv + vec2(0.0, o))) * 2.0;
    c += texture2D(uTexture, uv + vec2(-o, -o)) + texture2D(uTexture, uv + vec2(o, -o)) + texture2D(uTexture, uv + vec2(-o, o)) + texture2D(uTexture, uv + vec2(o, o));
    color = c / 16.0;
  }
  float reveal = clamp(uRevealProgress, 0.0, 1.0);
  float sdf = roundedRectSDF(vUv, vec2(reveal), 0.05 * reveal);
  float alpha = (1.0 - smoothstep(0.0, 0.002, sdf)) * smoothstep(0.1, 1.0, uRevealProgress);
  gl_FragColor = vec4(color.rgb, alpha);
}`

// Post-processing: fades the top and bottom 20% of the frame into #444.
export const fadeVertex = /* glsl */ `
varying vec2 vUv;
void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); vUv = uv; }`

export const fadeFragment = /* glsl */ `
uniform sampler2D tDiffuse;
uniform vec3 uFillColor;
varying vec2 vUv;
void main() {
  float b = clamp((vUv.y - 0.0) / 0.2 * -1.0 + 1.0, 0.0, 1.0);
  float t = clamp((vUv.y - 0.8) / 0.2, 0.0, 1.0);
  vec4 tex = texture2D(tDiffuse, vUv);
  gl_FragColor = vec4(mix(tex.rgb, uFillColor, clamp(t + b, 0.0, 1.0)), tex.a);
}`
