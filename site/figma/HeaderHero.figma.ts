// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5108-1176
// source=site/src/components/sections/IntroText.astro
// component=IntroText
import figma from 'figma'
const instance = figma.selectedInstance

// Figma header-hero = IntroText size "xl". Eyebrow y título viven en el
// title-hero anidado; Description es la propiedad del propio componente.
const titleHero = instance.findInstance('title-hero')
let eyebrow = ''
let title = ''
if (titleHero && titleHero.type === 'INSTANCE') {
  eyebrow = titleHero.getString('Eyebrow')
  title = titleHero.getString('Title')
}
const copy = instance.getString('Description')

export default {
  example: figma.code`<IntroText
  size="xl"
  eyebrow="${eyebrow}"
  title="${title}"
  copy="${copy}"
/>`,
  imports: ['import IntroText from "../components/sections/IntroText.astro"'],
  id: 'header-hero',
  metadata: { nestable: false }
}
