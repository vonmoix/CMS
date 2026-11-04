// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=663-4382
// source=site/src/components/CardSide.astro
// component=CardSide
import figma from 'figma'
const instance = figma.selectedInstance

// Figma card-right = CardSide variant "image-left" (imagen a la izquierda,
// texto a la derecha). Breakpoint lo resuelve el CSS. En el CMS se usa dentro
// de SectionMascot.astro.
const title = instance.getString('Title')
const copy = instance.getString('Content')

export default {
  example: figma.code`<CardSide variant="image-left">
  <h2 class="section-mascot__heading">${title}</h2>
  <p class="section-mascot__body">${copy}</p>
  <img slot="mockup" src="/images/landing/img_mascot.png" alt="" />
</CardSide>`,
  imports: ['import CardSide from "../components/CardSide.astro"'],
  id: 'card-right',
  metadata: { nestable: true }
}
