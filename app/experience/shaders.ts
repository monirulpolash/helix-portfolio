// GLSL for the project cards and the full-screen fade pass.
// These follow the decoded shaders of the reference helix line for line (dead code removed).

export const planeVertex = /* glsl */ `
  varying vec2 vUv;
  #define PI 3.14159265359
  uniform float uScrollSpeed;
  uniform float uBow;
  uniform float uCurve;
  uniform float uSpeedBend;

  void main() {
    vec3 worldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vec3 newPosition = position;
    newPosition.z = sin(uv.x * PI) * uBow;                           // bow the card
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    viewPosition.x += pow(worldPosition.y, 2.0) * uCurve;           // curve the column
    viewPosition.x += sin(uv.y * PI) * uScrollSpeed * uSpeedBend;   // bend with scroll speed
    gl_Position = projectionMatrix * viewPosition;
    vUv = uv;
  }
`

export const planeFragment = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uColorStrength;
  uniform float uZoom;
  uniform vec2 uPlaneSizes;
  uniform vec2 uImageSizes;
  uniform float uRevealProgress;
  uniform float uCornerRadius;
  varying vec2 vUv;

  float roundedRectSDF(vec2 uv, vec2 size, float radius) {
    vec2 d = abs(uv - 0.5) - size * 0.5 + radius;
    return length(max(d, 0.0)) - radius;
  }

  void main() {
    // object-fit: cover
    vec2 ratio = vec2(
      min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
      min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0));
    vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                   vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
    vec2 zoomedUv = (uv - 0.5) / uZoom + 0.5;

    vec4 color;
    if (gl_FrontFacing) {
      color = texture2D(uTexture, zoomedUv);
      color = mix(color, vec4(0.0, 0.0, 0.0, 1.0), uColorStrength);  // darken on hover
    } else {
      // Frosted back face: a 3x3 blur of the same image.
      float o = 40.0 / 1024.0;
      vec4 c = vec4(0.0);
      c += texture2D(uTexture, uv + vec2(-o, -o)) * 1.0;
      c += texture2D(uTexture, uv + vec2( 0.0, -o)) * 2.0;
      c += texture2D(uTexture, uv + vec2( o, -o)) * 1.0;
      c += texture2D(uTexture, uv + vec2(-o, 0.0)) * 2.0;
      c += texture2D(uTexture, uv) * 4.0;
      c += texture2D(uTexture, uv + vec2( o, 0.0)) * 2.0;
      c += texture2D(uTexture, uv + vec2(-o,  o)) * 1.0;
      c += texture2D(uTexture, uv + vec2( 0.0,  o)) * 2.0;
      c += texture2D(uTexture, uv + vec2( o,  o)) * 1.0;
      color = c / 16.0;
    }

    // Reveal: a rounded rectangle grows from the centre (fake scale + corner radius).
    float reveal = clamp(uRevealProgress, 0.0, 1.0);
    float sdf = roundedRectSDF(vUv, vec2(reveal), uCornerRadius * reveal);
    float alpha = 1.0 - smoothstep(0.0, 0.002, sdf);
    alpha *= smoothstep(0.1, 1.0, uRevealProgress);
    gl_FragColor = vec4(color.rgb, alpha);
  }
`

// Full-screen pass: fades the top and bottom 20% of the frame into the background colour.
export const fadeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
  }
`

export const fadeFragment = /* glsl */ `
  uniform sampler2D tDiffuse;
  uniform vec3 uFillColor;
  uniform float uEdge;
  varying vec2 vUv;
  void main() {
    float bottom = clamp(1.0 - vUv.y / uEdge, 0.0, 1.0);
    float top    = clamp((vUv.y - (1.0 - uEdge)) / uEdge, 0.0, 1.0);
    vec4 tex = texture2D(tDiffuse, vUv);
    // The scene target holds premultiplied colour over a transparent clear: composite it onto the
    // fill colour here and output an opaque frame (no browser alpha blending, no halo at the edges).
    vec3 color = tex.rgb + uFillColor * (1.0 - tex.a);
    gl_FragColor = vec4(mix(color, uFillColor, clamp(top + bottom, 0.0, 1.0)), 1.0);
  }
`
