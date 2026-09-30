// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=27-552
// source=site/src/components/sections/Hero.astro
// component=Hero
import figma from 'figma'
const instance = figma.selectedInstance

const showEyebrow = instance.getBoolean('Show Eyebrow')
const eyebrow = instance.getString('Eyebrow')
const title = instance.getString('Title')
const copy = instance.getString('Copy')
const showButton = instance.getBoolean('Show Button')
const button = instance.findInstance('Button')
let label = ''
if (button && button.type === 'INSTANCE') {
  label = button.getString('Label')
}

export default {
  example: figma.code`<Hero
  ${showEyebrow ? figma.code`eyebrow="${eyebrow}"` : ''}
  title="${title}"
  copy="${copy}"
  ${showButton ? figma.code`button={{ href: "/", label: "${label}" }}` : ''}
  image={{ src: "/images/hero-bienvenida.svg", alt: "" }}
/>`,
  imports: ['import Hero from "../components/sections/Hero.astro"'],
  id: 'hero',
  metadata: { nestable: false }
}
