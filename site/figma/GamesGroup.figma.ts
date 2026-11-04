// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5218-452
// source=site/src/components/sections/GamesGroup.astro
// component=GamesGroup
import figma from 'figma'
const instance = figma.selectedInstance

// Figma games-group (Breakpoint lo resuelve el CSS). Título y eyebrow viven en
// el title-section anidado; Description es la propiedad del propio componente.
// En el CMS, los gamesGroup consecutivos se agrupan en una section-games.
const titleSection = instance.findInstance('title-section')
let title = ''
if (titleSection && titleSection.type === 'INSTANCE') {
  title = titleSection.getString('Title')
}
const description = instance.getString('Description')

export default {
  example: figma.code`<GamesGroup
  title="${title}"
  description="${description}"
  cards={[{ title: "Flaming Gridlines", image: { src: "/images/games/flaming-gridlines.jpg", alt: "" }, playUrl: "#", sheetUrl: "#" }]}
/>`,
  imports: ['import GamesGroup from "../components/sections/GamesGroup.astro"'],
  id: 'games-group',
  metadata: { nestable: false }
}
