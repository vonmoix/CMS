// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5200-1972
// source=site/src/components/sections/SectionMascot.astro
// component=SectionMascot
import figma from 'figma'

// section-mascot: Breakpoint lo resuelve el CSS. Tipo de sección "sectionMascot".
export default {
  example: figma.code`<SectionMascot
  eyebrow="INTRODUCING..."
  signature={{ src: "/images/landing/img_mrzaar_sign.gif", alt: "mr. zaar" }}
  title="THERE ARE BRAINS BEHIND THOSE SHADES."
  highlight="BRAINS"
  copy="…"
  image={{ src: "/images/landing/img_mascot.png", alt: "" }}
/>`,
  imports: ['import SectionMascot from "../components/sections/SectionMascot.astro"'],
  id: 'section-mascot',
  metadata: { nestable: false }
}
