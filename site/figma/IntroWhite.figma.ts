// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=50-4877
// source=site/src/components/sections/IntroWhite.astro
// component=IntroWhite
import figma from 'figma'
const instance = figma.selectedInstance

const eyebrow = instance.findText('Eyebrow', { traverseInstances: true })
const heading = instance.findText('Title', { traverseInstances: true })
const description = instance.findText('Description', { traverseInstances: true })

export default {
  example: figma.code`<IntroWhite
  eyebrow="${eyebrow.textContent}"
  heading="${heading.textContent}"
  description="${description.textContent}"
/>`,
  imports: ['import IntroWhite from "../components/sections/IntroWhite.astro"'],
  id: 'intro-white',
  metadata: { nestable: false }
}
