<script setup lang="ts">
// Same as the original MenuContent: the white panel grows out of the menu pill (width and
// height on a spring), with a "subwrapper" layer under it.
defineProps<{ isMenuOpen: boolean }>()
</script>

<template>
  <div class="subwrapper" :class="isMenuOpen && 'opened'" />
  <div class="wrapper" :class="isMenuOpen && 'opened'">
    <div class="container">
      <MenuLinks :is-menu-open="isMenuOpen" />
      <MenuFooter />
    </div>
  </div>
</template>

<style scoped>
/* layout from the original MenuContent component */
.wrapper {
  height: 48rem;
  overflow: hidden;
  pointer-events: none;
  position: fixed;
  right: var(--grid-margin);
  top: var(--grid-margin);
  transition:
    width 0.9s var(--ease-spring),
    height 1s var(--ease-spring);
  width: 86.8rem;
  z-index: 40;
}
.wrapper.opened {
  height: calc(100dvh - var(--grid-margin) * 2);
  width: calc(var(--grid-column) * 4 + var(--grid-gutter) * 4);
}

@media (max-width: 1400px) {.wrapper.opened {
    width: calc(var(--grid-column) * 5 + var(--grid-gutter) * 4);
  }

}

@media (max-width: 1024px) {.wrapper.opened {
    width: calc(var(--grid-column) * 6 + var(--grid-gutter) * 5);
  }

}
.wrapper .container {
  color: var(--color-bg-dark);
  display: flex;
  flex-direction: column;
  height: calc(100dvh - var(--grid-margin) * 2);
  justify-content: center;
  padding: var(--gap-20);
  padding-left: 45rem;
  position: absolute;
  right: 0;
  top: 0;
  width: calc(var(--grid-column) * 4 + var(--grid-gutter) * 4);
}

@media (max-width: 1400px) {.wrapper .container {
    width: calc(var(--grid-column) * 5 + var(--grid-gutter) * 4);
  }

}

@media (max-width: 1024px) {.wrapper .container {
    width: calc(var(--grid-column) * 6 + var(--grid-gutter) * 5);
  }

}

@media screen and (max-width: 900px) {.wrapper .container {
    padding-left: var(--gap-20);
  }

}
.subwrapper {
  background-color: var(--color-white);
  border-radius: 24rem;
  height: 48rem;
  overflow: hidden;
  position: fixed;
  right: var(--grid-margin);
  top: var(--grid-margin);
  transition:
    width 0.9s var(--ease-spring),
    height 1s var(--ease-spring),
    border-radius 0.9s ease;
  width: 86.8rem;
  z-index: 15;
}
.subwrapper.opened {
  border-radius: 16rem;
  height: calc(100dvh - var(--grid-margin) * 2);
  width: calc(var(--grid-column) * 4 + var(--grid-gutter) * 4);
}

@media (max-width: 1400px) {.subwrapper.opened {
    width: calc(var(--grid-column) * 5 + var(--grid-gutter) * 4);
  }

}

@media (max-width: 1024px) {.subwrapper.opened {
    width: calc(var(--grid-column) * 6 + var(--grid-gutter) * 5);
  }

}
</style>
