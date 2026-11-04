// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5178-180
// source=site/src/components/sections/Gallery.astro
// component=Gallery
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')

export default {
  example: figma.code`<Gallery
  title="${title}"
  images={[{ src: "/images/placeholder-content.svg", alt: "" }]}
/>`,
  imports: ['import Gallery from "../components/sections/Gallery.astro"'],
  id: 'gallery',
  metadata: { nestable: false }
}
