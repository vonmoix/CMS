// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=50-3554
// source=site/src/components/CardImageLeft.astro
// component=CardImageLeft
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const content = instance.getString('Content')
const showImage = instance.getBoolean('Show Image')

export default {
  example: figma.code`<CardImageLeft
  title="${title}"
  content="${content}"
  image={{ src: "/images/imagen.png", alt: "" }}
  showImage={${showImage}}
/>`,
  imports: ['import CardImageLeft from "../components/CardImageLeft.astro"'],
  id: 'card-image-left',
  metadata: { nestable: false }
}
