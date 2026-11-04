// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=3178-10676
// source=site/src/components/TitleHero.astro
// component=TitleHero
import figma from 'figma'
const instance = figma.selectedInstance

const eyebrow = instance.getString('Eyebrow')
const title = instance.getString('Title')

export default {
  example: figma.code`<TitleHero
  eyebrow="${eyebrow}"
  title="${title}"
/>`,
  imports: ['import TitleHero from "../components/TitleHero.astro"'],
  id: 'title-hero',
  metadata: { nestable: true }
}
