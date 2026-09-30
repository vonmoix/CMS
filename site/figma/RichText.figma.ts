// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=8-19
// source=site/src/components/sections/RichText.astro
// component=RichText
import figma from 'figma'
const instance = figma.selectedInstance

const eyebrow = instance.getString('Eyebrow')
const heading = instance.getString('Title')
const body = instance.getString('Text')

export default {
  example: figma.code`<RichText eyebrow="${eyebrow}" heading="${heading}" body="${body}" />`,
  imports: ['import RichText from "../components/sections/RichText.astro"'],
  id: 'rich-text',
  metadata: { nestable: false }
}
