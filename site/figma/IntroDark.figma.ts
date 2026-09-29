// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=50-4915
// source=site/src/components/sections/IntroDark.astro
// component=IntroDark
import figma from 'figma'
const instance = figma.selectedInstance

const eyebrow = instance.findText('Eyebrow', { traverseInstances: true })
const heading = instance.findText('Title', { traverseInstances: true })
const description = instance.getString('Description')

export default {
  example: figma.code`<IntroDark
  eyebrow="${eyebrow.textContent}"
  heading="${heading.textContent}"
  description="${description}"
/>`,
  imports: ['import IntroDark from "../components/sections/IntroDark.astro"'],
  id: 'intro-dark',
  metadata: { nestable: false }
}
