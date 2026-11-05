// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=3178-10676
// source=site/src/components/sections/IntroText.astro
// component=IntroText
import figma from 'figma'
const instance = figma.selectedInstance

// Figma title-hero = componente "Title" del CMS (tipo titleHero) con size "xl":
// IntroText sin descripción. El color lo decide la franja (surface).
const eyebrow = instance.getString('Eyebrow')
const title = instance.getString('Title')

export default {
  example: figma.code`<IntroText
  size="xl"
  eyebrow="${eyebrow}"
  title="${title}"
/>`,
  imports: ['import IntroText from "../components/sections/IntroText.astro"'],
  id: 'title-hero',
  metadata: { nestable: true }
}
