// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=8-19
// source=site/src/components/sections/RichText.astro
// component=RichText
import figma from 'figma'
const instance = figma.selectedInstance

const heading = instance.getString('Heading')
const body = instance.getString('Body')

export default {
  example: figma.code`<RichText heading="${heading}" body="${body}" />`,
  imports: ['import RichText from "../components/sections/RichText.astro"'],
  id: 'rich-text',
  metadata: { nestable: false }
}
