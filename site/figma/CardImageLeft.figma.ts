// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=662-4954
// source=site/src/components/CardImageLeft.astro
// component=CardImageLeft
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
// Figma card-left: Title + Subtitle (el texto), Breakpoint lo resuelve el CSS
const copy = instance.getString('Subtitle')

export default {
  example: figma.code`<CardImageLeft
  title="${title}"
  copy="${copy}"
  image={{ src: "/images/imagen.png", alt: "" }}
/>`,
  imports: ['import CardImageLeft from "../components/CardImageLeft.astro"'],
  id: 'card-image-left',
  metadata: { nestable: false }
}
