// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5177-170
// source=site/src/components/FaqItem.astro
// component=FaqItem
import figma from 'figma'
const instance = figma.selectedInstance

const question = instance.getString('Question')
const answer = instance.getString('Answer')
const open = instance.getEnum('State', { 'Collapsed': false, 'Expanded': true })

export default {
  example: figma.code`<FaqItem
  question="${question}"
  answer="${answer}"
  ${open ? figma.code`open` : ''}
/>`,
  imports: ['import FaqItem from "../components/FaqItem.astro"'],
  id: 'faq-item',
  metadata: { nestable: true }
}
