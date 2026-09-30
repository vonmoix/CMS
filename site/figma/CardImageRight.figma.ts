// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=50-3539
// source=site/src/components/CardImageRight.astro
// component=CardImageRight
import figma from 'figma'
const instance = figma.selectedInstance

const eyebrow = instance.getString('Eyebrow')
const title = instance.getString('Title')
const body = instance.getString('Subtitle')

export default {
  example: figma.code`<CardImageRight
  eyebrow="${eyebrow}"
  title="${title}"
  body="${body}"
  image={{ src: "/images/imagen.png", alt: "" }}
/>`,
  imports: ['import CardImageRight from "../components/CardImageRight.astro"'],
  id: 'card-image-right',
  metadata: { nestable: false }
}
