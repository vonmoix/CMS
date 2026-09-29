// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=21-17
// source=site/src/components/sections/Faq.astro
// component=Faq
import figma from 'figma'
const instance = figma.selectedInstance

const heading = instance.getString('Heading')

export default {
  example: figma.code`<Faq
  heading="${heading}"
  items={[
    { question: "¿Pregunta?", answer: "Respuesta." },
  ]}
/>`,
  imports: ['import Faq from "../components/sections/Faq.astro"'],
  id: 'faq',
  metadata: { nestable: false }
}
