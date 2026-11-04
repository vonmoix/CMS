// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5218-452
// source=site/src/components/sections/CardGallery.astro
// component=CardGallery
import figma from 'figma'
const instance = figma.selectedInstance

// Figma games-group (Breakpoint lo resuelve el CSS). El título vive en el
// title-section anidado. CardGallery aún no tiene descripción (pendiente de
// pasar a games-group / section-games, como en la landing).
const titleSection = instance.findInstance('title-section')
let title = ''
if (titleSection && titleSection.type === 'INSTANCE') {
  title = titleSection.getString('Title')
}

export default {
  example: figma.code`<CardGallery
  title="${title}"
  cards={[{ title: "Flaming Gridlines", image: { src: "/images/games/flaming.jpg", alt: "" }, playUrl: "#", sheetUrl: "#" }]}
/>`,
  imports: ['import CardGallery from "../components/sections/CardGallery.astro"'],
  id: 'games-group',
  metadata: { nestable: false }
}
