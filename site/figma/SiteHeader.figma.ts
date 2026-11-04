// url=https://www.figma.com/design/X5HoVxlC6u3yLP1tqkLpN9/Playzaar-Webs-1.0?node-id=662-4870
// source=site/src/components/SiteHeader.astro
// component=SiteHeader
import figma from 'figma'

export default {
  example: figma.code`<SiteHeader pages={navPages} currentPath={currentPath} />`,
  imports: ['import SiteHeader from "../components/SiteHeader.astro"'],
  id: 'site-header',
  metadata: { nestable: false }
}
