// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5178-209
// source=site/src/components/sections/TextImage.astro
// component=TextImage
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')
const copy = instance.getString('Copy')
const imagePosition = instance.getEnum('Align', {
  'Right': 'right',
  'Left': 'left',
  'Mobile': 'right',
})

export default {
  example: figma.code`<TextImage
  title="${title}"
  copy="${copy}"
  imagePosition="${imagePosition}"
  image={{ src: "/images/como-funciona.svg", alt: "" }}
/>`,
  imports: ['import TextImage from "../components/sections/TextImage.astro"'],
  id: 'text-image',
  metadata: { nestable: false }
}
