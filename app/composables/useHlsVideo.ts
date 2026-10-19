import Hls from 'hls.js'
import type { Ref } from 'vue'

// Same HLS setup as the original VideoPlayer / VideoPreview: hls.js everywhere except Apple
// browsers, which play the .m3u8 natively. Starts playback once the manifest is parsed.
export function attachHls(video: HTMLVideoElement, src: string, opts: { muted?: boolean } = {}): Hls | null {
  const isApple = window.navigator.vendor.indexOf('Apple') !== -1
  if (Hls.isSupported() && !isApple) {
    const hls = new Hls({ startLevel: -1, abrEwmaDefaultEstimate: 5e6, maxBufferLength: 30, lowLatencyMode: false })
    hls.loadSource(src)
    hls.attachMedia(video)
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (opts.muted) video.muted = true
      video.play().catch(() => {})
    })
    return hls
  }
  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = src
    video.play().catch(() => {})
  }
  return null
}

export type VideoRef = Ref<HTMLVideoElement | null>
