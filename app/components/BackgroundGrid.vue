<template>
  <!-- 50px grid at 20% white, faded out by a blurred ellipse of the page colour -->
  <svg width="1920" height="1200" viewBox="0 0 1920 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="bg-grid" patternUnits="userSpaceOnUse" width="50" height="50" x="-15.25" y="24.75">
        <rect width="50" height="50" stroke="white" stroke-width="1" fill="none" />
      </pattern>
      <filter id="bg-blur" x="-1022" y="-826" width="3964" height="2852" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="250" />
      </filter>
      <clipPath id="bg-clip"><rect width="1920" height="1200" /></clipPath>
    </defs>
    <g clip-path="url(#bg-clip)">
      <rect width="1920" height="1200" fill="url(#bg-grid)" fill-opacity="0.2" />
      <path
        filter="url(#bg-blur)" fill-rule="evenodd" fill="#0A0A0A"
        d="M2442 1526H-522V-326H2442V1526ZM960 14C453 14 42 276.6 42 600.5C42 924.4 453 1187 960 1187C1467 1187 1878 924.4 1878 600.5C1878 276.6 1467 14 960 14Z"
      />
    </g>
  </svg>
</template>

<style scoped>
/* layout from the original BackgroundGrid component */
svg {
  height: 100%;
  left: 0;
  -o-object-fit: cover;
  object-fit: cover;
  opacity: 0.4;
  pointer-events: none;
  position: fixed;
  top: 0;
  width: auto;
  z-index: 0;
}
</style>
