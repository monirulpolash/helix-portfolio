import { shallowReactive } from 'vue'
import type { Experience } from '~/experience/Experience'
import type { HelixProject } from '~/experience/ProjectPlane'

// Shared, client-side state of the WebGL helix. The Experience instance lives outside Vue's
// reactivity (it is a plain class), only the flags the UI needs are reactive.
const state = shallowReactive({
  experience: null as Experience | null,
  progress: 0,
  ready: false,
  entered: false,
  failed: false,
  hovered: null as HelixProject | null,
  mode: 'spiral' as 'spiral' | 'list',
})

export function useHelix() {
  return state
}
