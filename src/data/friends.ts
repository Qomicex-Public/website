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
 * 当前收录 MCNav —— 其站点公告明确要求「主动提交网站前请添加 MCNav 友情链接」，
 * 因此本站需先挂上该友链，再向其提交收录申请。
 *
 * 新增友链只需往数组里加一项；关于页会自动渲染。
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
