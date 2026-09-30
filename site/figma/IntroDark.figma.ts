// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=50-4915
// source=site/src/components/sections/Intro.astro
// component=Intro
import figma from 'figma'
const instance = figma.selectedInstance

const eyebrow = instance.getString('Eyebrow')
const heading = instance.getString('Title')
const description = instance.getString('Description')

export default {
  example: figma.code`<Intro
  size="m"
  eyebrow="${eyebrow}"
  heading="${heading}"
  description="${description}"
/>`,
  imports: ['import Intro from "../components/sections/Intro.astro"'],
  id: 'intro-dark',
  metadata: { nestable: false }
}
