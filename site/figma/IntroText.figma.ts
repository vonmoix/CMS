// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=119-1527
// source=site/src/components/sections/IntroText.astro
// component=IntroText
import figma from 'figma'
const instance = figma.selectedInstance

const eyebrow = instance.getString('Eyebrow')
const heading = instance.getString('Title')
const description = instance.getString('Description')
// El color (Theme) no se mapea: en código lo decide la franja (surface)
const size = instance.getEnum('Size', { XL: 'xl', L: 'l' })

export default {
  example: figma.code`<IntroText
  size="${size}"
  eyebrow="${eyebrow}"
  heading="${heading}"
  description="${description}"
/>`,
  imports: ['import IntroText from "../components/sections/IntroText.astro"'],
  id: 'intro-text',
  metadata: { nestable: false }
}
