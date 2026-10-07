import type { Lang } from '../i18n'

export interface FriendSite {
  /** 站点显示名 */
  name: string
  /** 站点首页（外链，渲染时加 target=_blank rel=noopener） */
  url: string
  /** 站点描述（双语）。内容取自对方站点的真实定位，不编造 */
  desc: Record<Lang, string>
}

/**
 * 友情链接 / 友链伙伴。
 *
 * 收录标准：与本站同属 Minecraft 生态、长期运营、内容真实且与本站互补的站点。
 * 描述取自对对方站点的实际访问结论，不编造、不堆砌关键词。
 *
 * 新增友链只需往数组里追加一项；关于页会自动渲染。
 */
export const friends: FriendSite[] = [
  {
    name: 'MCNav',
    url: 'https://www.mcnav.net/',
    desc: {
      zh: 'Minecraft 综合导航站，收录官方站点、社区、百科、工具、服务端与资源',
      en: 'A Minecraft navigation directory covering official sites, communities, wikis, tools, servers and resources',
    },
  },
]
