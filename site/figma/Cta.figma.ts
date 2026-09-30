// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=8-22
// source=site/src/components/sections/Cta.astro
// component=Cta
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const button = instance.findInstance('Button')
let label = ''
if (button && button.type === 'INSTANCE') {
  label = button.getString('Label')
}

export default {
  example: figma.code`<Cta
  title="${title}"
  button={{ href: "/", label: "${label}" }}
/>`,
  imports: ['import Cta from "../components/sections/Cta.astro"'],
  id: 'cta',
  metadata: { nestable: false }
}
