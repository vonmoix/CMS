// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=1034-4607
// source=site/src/components/sections/SectionVideo.astro
// component=SectionVideo
import figma from 'figma'

// section-video: portada a sangre con vídeo. Play/pausa y mute no son props:
// los gestiona el script del componente (igual que landing/main.js).
export default {
  example: figma.code`<SectionVideo
  video="/videos/hero-video.mp4"
  videoWebm="/videos/hero-video.webm"
  poster={{ src: "/images/hero-video-poster.png", alt: "" }}
/>`,
  imports: ['import SectionVideo from "../components/sections/SectionVideo.astro"'],
  id: 'section-video',
  metadata: { nestable: false }
}
