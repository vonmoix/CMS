// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=662-4954
// source=site/src/components/CardSide.astro
// component=CardSide
import figma from 'figma'
const instance = figma.selectedInstance

// Figma card-left = CardSide variant "image-right" (texto a la izquierda, imagen
// a la derecha). Breakpoint lo resuelve el CSS. En el CMS se usa dentro de
// SectionImageCard.astro.
const title = instance.getString('Title')
const copy = instance.getString('Subtitle')

export default {
  example: figma.code`<CardSide variant="image-right">
  <h2 class="section-image-card__heading">${title}</h2>
  <p class="section-image-card__body">${copy}</p>
  <img slot="mockup" src="/images/landing/img_text_carrousel.png" alt="" />
</CardSide>`,
  imports: ['import CardSide from "../components/CardSide.astro"'],
  id: 'card-left',
  metadata: { nestable: true }
}
