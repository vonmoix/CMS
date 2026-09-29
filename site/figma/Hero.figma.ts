// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=27-552
// source=site/src/components/sections/Hero.astro
// component=Hero
import figma from 'figma'
const instance = figma.selectedInstance

const showEyebrow = instance.getBoolean('Eyebrow')
const eyebrow = instance.getString('Eyebrow text')
const heading = instance.getString('Heading')
const subheading = instance.getString('Subheading')
const showButton = instance.getBoolean('Button')
const button = instance.findInstance('Button')
let label = ''
if (button && button.type === 'INSTANCE') {
  label = button.getString('Label')
}

export default {
  example: figma.code`<Hero
  ${showEyebrow ? figma.code`eyebrow="${eyebrow}"` : ''}
  heading="${heading}"
  subheading="${subheading}"
  ${showButton ? figma.code`button={{ href: "/", label: "${label}" }}` : ''}
  image={{ src: "/images/hero-bienvenida.svg", alt: "" }}
/>`,
  imports: ['import Hero from "../components/sections/Hero.astro"'],
  id: 'hero',
  metadata: { nestable: false }
}
