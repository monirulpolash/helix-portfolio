// Every tunable number of the helix in one place.
// The values match the ones decoded from the reference site's shaders and scroll code.

export const HELIX = {
  planeWidth: 1.7, // world units, 1.7 : 1 card
  planeHeight: 1,
  segments: 8, // 8 x 8 grid, needed for the vertex bow
  radius: 2, // distance of each card from the helix axis
  angleGap: 0.85, // radians between neighbouring cards (~48.7 deg)
  verticalGap: 0.5, // rise per card
  yOffset: -0.8, // pulls the whole helix down a little
  copies: 2, // the list is used twice so the wrap-around happens out of sight
}

export const SHADER = {
  bow: 0.2, // newPosition.z = sin(uv.x * PI) * 0.2
  curve: 0.1, // viewPosition.x += pow(worldY, 2.0) * 0.1
  speedBend: 2.0, // viewPosition.x += sin(uv.y * PI) * speed * 2.0
  cornerRadius: 0.05,
  colorStrength: 0.55, // hover darkens the card 55% towards black
  zoom: 0.05, // and zooms the image 5%
  hoverShrink: 0.05, // and shrinks the card 5%
  fadeEdge: 0.2, // top and bottom 20% of the frame fade into the fill colour
}

export const SCROLL = {
  wheelFactor: 0.00015, // deltaY -> target speed
  easing: 0.1, // speed chases target by 10% per 60 fps frame
  friction: 0.9, // target decays by 10% per 60 fps frame
  minSpeed: 0.002, // idle drift so the helix never fully stops
  maxSpeed: 2,
  touchFactor: 0.0015, // px of swipe -> target speed (0.5 * 0.003)
  touchFling: 0.001, // last move delta -> extra speed on release (0.5 * 0.002)
  dragThreshold: 8, // px before a touch counts as a swipe instead of a tap
  keyStep: 0.02, // arrow keys
}

export const CAMERA = {
  fovDesktop: 35,
  fovMobile: 45,
  breakpoint: 900, // px; below this the wider FOV is used
  z: 8,
  near: 0.1,
  far: 100,
}

export const MOTION = {
  hoverIn: 0.09, // lerp rates, applied as 1 - (1 - rate) ^ (dt * 0.2)
  hoverOut: 0.07,
  hoverTimeScale: 0.2,
  hideRate: 0.05, // 1 - (1 - 0.05) ^ (dt * 0.15)
  hideTimeScale: 0.15,
  drop: 1.5, // cards sink 1.5 units when hiding, fall in from 1.5 above when revealing
  revealStagger: 50, // ms between cards, in groups of four
  hideStagger: 30,
  enterDelay: 200, // after the Enter button
  returnDelay: 300, // when coming back to the home page
}

export const LOOK = {
  fillColor: '#444444',
  maxPixelRatio: 2,
}
