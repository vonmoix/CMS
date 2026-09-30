// url=https://www.figma.com/design/wYCxI2epUKcZdjPse5nAIV/CMS?node-id=2-150
// source=site/src/components/SiteHeader.astro
// component=SiteHeader
import figma from 'figma'

export default {
  example: figma.code`<SiteHeader pages={navPages} currentPath={currentPath} />`,
  imports: ['import SiteHeader from "../components/SiteHeader.astro"'],
  id: 'site-header',
  metadata: { nestable: false }
}
