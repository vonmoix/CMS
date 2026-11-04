// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=5172-90
// source=site/src/components/CardPt.astro
// component=CardPt
import figma from 'figma'

// Input (Pointer / Touch / Touch Compact) y State (Default / Hover / Focus)
// no son props: en código los resuelven las media queries, el container query
// y :hover / :focus-within, así que el ejemplo no los lee.
export default {
  example: figma.code`<CardPt
  title="Nombre del juego"
  image={{ src: "/images/games/juego.jpg", alt: "" }}
  playHref="/"
  sheetHref="/"
/>`,
  imports: ['import CardPt from "../components/CardPt.astro"'],
  id: 'card-pt',
  metadata: { nestable: true }
}
