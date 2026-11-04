// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5168-19
// source=site/src/components/sections/Carousel.astro
// component=Carousel
import figma from 'figma'

// El carousel de Webs no expone el título como propiedad: el ejemplo lo deja fijo.

export default {
  example: figma.code`<Carousel
  title="Featured Games"
  cards={[{ title: "Flaming Gridlines", image: { src: "/images/games/flaming.jpg", alt: "" }, playUrl: "#", sheetUrl: "#" }]}
/>`,
  imports: ['import Carousel from "../components/sections/Carousel.astro"'],
  id: 'carousel',
  metadata: { nestable: false }
}
