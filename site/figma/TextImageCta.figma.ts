// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5178-243
// source=site/src/components/sections/Hero.astro
// component=Hero
import figma from 'figma'
const instance = figma.selectedInstance

const showEyebrow = instance.getBoolean('Show Eyebrow')
const eyebrow = instance.getString('Eyebrow')
const title = instance.getString('Title')
const copy = instance.getString('Copy')
const align = instance.getEnum('Align', { Right: 'right', Left: 'left', Mobile: 'right' })
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
  imagePosition="${align}"
  ${showButton ? figma.code`button={{ href: "/", label: "${label}" }}` : ''}
  image={{ src: "/images/hero-bienvenida.svg", alt: "" }}
/>`,
  imports: ['import Hero from "../components/sections/Hero.astro"'],
  id: 'text-image-cta',
  metadata: { nestable: false }
}
