// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5177-197
// source=site/src/components/sections/Faq.astro
// component=Faq
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')

export default {
  example: figma.code`<Faq
  title="${title}"
  items={[
    { question: "¿Pregunta?", answer: "Respuesta." },
  ]}
/>`,
  imports: ['import Faq from "../components/sections/Faq.astro"'],
  id: 'faq',
  metadata: { nestable: false }
}
