// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=3124-8606
// source=site/src/components/sections/IntroText.astro
// component=IntroText
import figma from 'figma'
const instance = figma.selectedInstance

// Figma title-section = componente "Title" del CMS (tipo titleHero) con size "l":
// IntroText sin descripción. El color lo decide la franja (surface).
const showEyebrow = instance.getBoolean('Show eyebrow')
const eyebrow = showEyebrow ? instance.getString('Eyebrow') : ''
const title = instance.getString('Title')

export default {
  example: figma.code`<IntroText
  size="l"
  eyebrow="${eyebrow}"
  title="${title}"
/>`,
  imports: ['import IntroText from "../components/sections/IntroText.astro"'],
  id: 'title-section',
  metadata: { nestable: true }
}
