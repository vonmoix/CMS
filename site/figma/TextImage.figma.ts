// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=2-152
// source=site/src/components/sections/TextImage.astro
// component=TextImage
import figma from 'figma'
const instance = figma.selectedInstance

const heading = instance.getString('Heading')
const body = instance.getString('Body')
const imagePosition = instance.getEnum('Align', {
  'Right': 'right',
  'Left': 'left',
  'Mobile': 'right',
})

export default {
  example: figma.code`<TextImage
  heading="${heading}"
  body="${body}"
  imagePosition="${imagePosition}"
  image={{ src: "/images/como-funciona.svg", alt: "" }}
/>`,
  imports: ['import TextImage from "../components/sections/TextImage.astro"'],
  id: 'text-image',
  metadata: { nestable: false }
}
