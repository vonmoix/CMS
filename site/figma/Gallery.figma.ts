// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=8-26
// source=site/src/components/sections/Gallery.astro
// component=Gallery
import figma from 'figma'
const instance = figma.selectedInstance

const heading = instance.getString('Heading')

export default {
  example: figma.code`<Gallery
  heading="${heading}"
  images={[{ src: "/images/placeholder-content.svg", alt: "" }]}
/>`,
  imports: ['import Gallery from "../components/sections/Gallery.astro"'],
  id: 'gallery',
  metadata: { nestable: false }
}
