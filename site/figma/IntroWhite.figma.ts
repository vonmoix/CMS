// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=50-4877
// source=site/src/components/sections/IntroWhite.astro
// component=IntroWhite
import figma from 'figma'
const instance = figma.selectedInstance

const eyebrow = instance.getString('Eyebrow')
const heading = instance.getString('Title')
const description = instance.getString('Text')

export default {
  example: figma.code`<IntroWhite
  eyebrow="${eyebrow}"
  heading="${heading}"
  description="${description}"
/>`,
  imports: ['import IntroWhite from "../components/sections/IntroWhite.astro"'],
  id: 'intro-white',
  metadata: { nestable: false }
}
