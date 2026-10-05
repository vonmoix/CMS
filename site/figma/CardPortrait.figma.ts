// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=145-4660
// source=site/src/components/CardPortrait.astro
// component=CardPortrait
import figma from 'figma'

// Input (Pointer / Touch / Touch Compact) y State (Default / Hover / Focus)
// no son props: en código los resuelven las media queries, el container query
// y :hover / :focus-within, así que el ejemplo no los lee.
export default {
  example: figma.code`<CardPortrait
  title="Nombre del juego"
  image={{ src: "/images/games/juego.jpg", alt: "" }}
  playHref="/"
  sheetHref="/"
/>`,
  imports: ['import CardPortrait from "../components/CardPortrait.astro"'],
  id: 'card-portrait',
  metadata: { nestable: true }
}
