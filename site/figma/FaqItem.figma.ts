// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=20-12
// source=site/src/components/FaqItem.astro
// component=FaqItem
import figma from 'figma'
const instance = figma.selectedInstance

const question = instance.getString('Title')
const answer = instance.getString('Copy')
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
