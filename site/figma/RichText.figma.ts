// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=8-19
// source=site/src/components/sections/IntroText.astro
// component=IntroText
import figma from 'figma'
const instance = figma.selectedInstance

const eyebrow = instance.getString('Eyebrow')
const heading = instance.getString('Title')
const body = instance.getString('Text')

export default {
  example: figma.code`<IntroText size="l" eyebrow="${eyebrow}" heading="${heading}" description="${body}" />`,
  imports: ['import IntroText from "../components/sections/IntroText.astro"'],
  id: 'rich-text',
  metadata: { nestable: false }
}
