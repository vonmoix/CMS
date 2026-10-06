// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=193-1089
// source=site/src/components/sections/Carousel.astro
// component=Carousel
import figma from 'figma'
const instance = figma.selectedInstance

const title = instance.getString('Title')

export default {
  example: figma.code`<Carousel
  title="${title}"
  cards={[{ title: "Flaming Gridlines", image: { src: "/images/games/flaming.jpg", alt: "" }, playUrl: "#", sheetUrl: "#" }]}
/>`,
  imports: ['import Carousel from "../components/sections/Carousel.astro"'],
  id: 'carousel',
  metadata: { nestable: false }
}
