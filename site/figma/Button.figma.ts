// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=50-4946
// source=site/src/components/Button.astro
// component=Button
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('Label')
const type = instance.getEnum('Type', {
  'Primary': 'primary',
  'Secondary': 'secondary',
  'Tertiary': 'tertiary',
  'Ghost Primary': 'ghost-primary',
  'Ghost Secondary': 'ghost-secondary'
})
const size = instance.getEnum('Size', { 'L': 'l', 'M': 'm', 'S': 's' })

export default {
  example: figma.code`<Button
  label="${label}"
  href="/"
  type="${type}"
  size="${size}"
/>`,
  imports: ['import Button from "../components/Button.astro"'],
  id: 'button',
  metadata: { nestable: true }
}
