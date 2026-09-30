// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=111-2904
// source=site/src/components/sections/HeroVideo.astro
// component=HeroVideo
import figma from 'figma'

export default {
  example: figma.code`<HeroVideo
  video="/videos/hero-video.mp4"
  poster={{ src: "/images/hero-video-poster.png", alt: "" }}
/>`,
  imports: ['import HeroVideo from "../components/sections/HeroVideo.astro"'],
  id: 'hero-video',
  metadata: { nestable: false }
}
