// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=55-1722
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
