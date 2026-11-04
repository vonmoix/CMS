// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=3459-4347
// source=site/src/components/sections/IntroText.astro
// component=IntroText
import figma from 'figma'
const instance = figma.selectedInstance

// Figma header-section = IntroText size "l". Eyebrow y título viven en el
// title-section anidado; Description es la propiedad del propio componente.
// El color no se mapea: en código lo decide la franja (surface).
const titleSection = instance.findInstance('title-section')
let eyebrow = ''
let title = ''
if (titleSection && titleSection.type === 'INSTANCE') {
  eyebrow = titleSection.getString('Eyebrow')
  title = titleSection.getString('Title')
}
const copy = instance.getString('Description')

export default {
  example: figma.code`<IntroText
  size="l"
  eyebrow="${eyebrow}"
  title="${title}"
  copy="${copy}"
/>`,
  imports: ['import IntroText from "../components/sections/IntroText.astro"'],
  id: 'header-section',
  metadata: { nestable: false }
}
