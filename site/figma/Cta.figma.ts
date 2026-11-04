// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5178-175
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
