// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=50-4915
// source=site/src/components/sections/IntroText.astro
// component=IntroText
import figma from 'figma'
const instance = figma.selectedInstance

const eyebrow = instance.getString('Eyebrow')
const heading = instance.getString('Title')
const description = instance.getString('Description')

export default {
  example: figma.code`<IntroText
  size="xl"
  eyebrow="${eyebrow}"
  heading="${heading}"
  description="${description}"
/>`,
  imports: ['import IntroText from "../components/sections/IntroText.astro"'],
  id: 'intro-dark',
  metadata: { nestable: false }
}
