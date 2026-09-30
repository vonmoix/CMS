// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=2-152
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
