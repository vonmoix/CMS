// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=180-1111
// source=site/src/components/sections/CardGallery.astro
// component=CardGallery
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')

export default {
  example: figma.code`<CardGallery
  title="${title}"
  cards={[{ title: "Flaming Gridlines", image: { src: "/images/games/flaming.jpg", alt: "" }, playUrl: "#", sheetUrl: "#" }]}
/>`,
  imports: ['import CardGallery from "../components/sections/CardGallery.astro"'],
  id: 'gallery-games',
  metadata: { nestable: false }
}
