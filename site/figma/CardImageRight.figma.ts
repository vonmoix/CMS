// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=663-4382
// source=site/src/components/CardImageRight.astro
// component=CardImageRight
import figma from 'figma'
const instance = figma.selectedInstance

// Figma card-right: Title + Content (sin eyebrow), Breakpoint lo resuelve el CSS
const title = instance.getString('Title')
const copy = instance.getString('Content')

export default {
  example: figma.code`<CardImageRight
  title="${title}"
  copy="${copy}"
  image={{ src: "/images/imagen.png", alt: "" }}
/>`,
  imports: ['import CardImageRight from "../components/CardImageRight.astro"'],
  id: 'card-image-right',
  metadata: { nestable: false }
}
