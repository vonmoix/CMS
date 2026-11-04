// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5200-1897
// source=site/src/components/sections/SectionImageCard.astro
// component=SectionImageCard
import figma from 'figma'

// section-image-card: Breakpoint lo resuelve el CSS. Tipo de sección "sectionImageCard".
export default {
  example: figma.code`<SectionImageCard
  background={{ src: "/images/landing/img_carrousel_desktop.png", alt: "Playzaar game catalogue" }}
  backgroundMobile={{ src: "/images/landing/img_carrousel_mobile.png", alt: "" }}
  eyebrow="A PORTFOLIO THAT DOESN’T BLEND IN"
  title="DESIGNED TO KEEP PLAYERS ENTERTAINED"
  highlight="ENTERTAINED"
  copy="…"
  image={{ src: "/images/landing/img_text_carrousel.png", alt: "" }}
/>`,
  imports: ['import SectionImageCard from "../components/sections/SectionImageCard.astro"'],
  id: 'section-image-card',
  metadata: { nestable: false }
}
