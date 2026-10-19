<template>
  <!-- Same layout as the original: a star sticker behind a "click!!" speech tag that pops in
       next to the logo on hover. Both drawings are own placeholders. -->
  <div class="logo-tag-wrapper">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 74 71" class="star">
      <defs>
        <linearGradient id="logo-star-grad" x1="7" x2="66" y1="65" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset=".1" stop-color="#fdff6c" />
          <stop offset="1" stop-color="#21ffc0" />
        </linearGradient>
      </defs>
      <path fill="url(#logo-star-grad)" d="M37 1l6.5 22.5L64 12 52.5 32 73 39l-22 4.5L60 66 41 50.5 33 70l-4-21.5L9 61l12-18.5L1 34l21-3.5L12 9l19.5 11z" />
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 157 60" class="tag">
      <path fill="#f8f8f8" d="M130 59.6H0l16.7-46.4A20 20 0 0 1 35.6 0H137A20 20 0 0 1 156 26.9l-7 19.4a20 20 0 0 1-19 13.3Z" />
      <text x="84" y="42" text-anchor="middle" fill="#0a0a0a" font-size="28" font-weight="600" font-family="var(--main-font)" letter-spacing="-1">click!!</text>
    </svg>
  </div>
</template>

<style scoped>
/* layout from the original HeaderLogoTag component */
.logo-tag-wrapper {
  height: -moz-fit-content;
  height: fit-content;
  left: calc(100% + 8rem);
  pointer-events: none;
  position: absolute;
  top: 16rem;
  width: -moz-fit-content;
  width: fit-content;
}
.logo-tag-wrapper .tag {
  height: auto;
  width: 80rem;
}
.logo-tag-wrapper .star {
  height: auto;
  position: absolute;
  right: -12rem;
  top: -12rem;
  width: 32rem;
  z-index: -1;
}
</style>
