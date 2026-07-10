export interface Asset {
  name: string
  url: string
  platform?: 'windows' | 'macos-intel' | 'macos-arm' | 'linux'
}

export interface Release {
  tagName: string
  version: string
  prerelease: boolean
  publishedAt: string
  htmlUrl: string
  assets: Asset[]
  changes: string[]
}

export interface Mirror { label: string; url: string; best: boolean }

export const MIRRORS: Mirror[] = [
  { label: 'GitHub 直连', url: '', best: true },
  { label: 'gh.lenmei233.top', url: 'https://gh.lenmei233.top/', best: true },
  { label: 'ghfast.top', url: 'https://ghfast.top/', best: true },
  { label: 'ghproxy.053000.xyz', url: 'https://ghproxy.053000.xyz/', best: true },
  { label: 'gh-proxy.com', url: 'https://gh-proxy.com/', best: true },
  { label: 'gh.xxooo.cf', url: 'https://gh.xxooo.cf/', best: true },
  { label: 'github.dpik.top', url: 'https://github.dpik.top/', best: false },
  { label: 'github.xxlab.tech', url: 'https://github.xxlab.tech/', best: false },
  { label: '30006000.xyz', url: 'https://30006000.xyz/', best: false },
  { label: 'git.40609891.xyz', url: 'https://git.40609891.xyz/', best: false },
  { label: 'ghproxy.mirror.skybyte.me', url: 'https://ghproxy.mirror.skybyte.me/', best: false },
  { label: 'ghproxy.sakuramoe.dev', url: 'https://ghproxy.sakuramoe.dev/', best: false },
  { label: 'gh.jasonzeng.dev', url: 'https://gh.jasonzeng.dev/', best: false },
  { label: 'gh.padao.fun', url: 'https://gh.padao.fun/', best: false },
  { label: 'gh.halonice.com', url: 'https://gh.halonice.com/', best: false },
  { label: 'gh.ddlc.top', url: 'https://gh.ddlc.top/', best: false },
  { label: 'gh.39.al', url: 'https://gh.39.al/', best: false },
  { label: 'gh.shiina-rimo.cafe', url: 'https://gh.shiina-rimo.cafe/', best: false },
  { label: 'github.lsdfxdk.nyc.mn', url: 'https://github.lsdfxdk.nyc.mn/', best: false },
  { label: 'github-proxy.memory-echoes.cn', url: 'https://github-proxy.memory-echoes.cn/', best: false },
  { label: 'github.chenc.dev', url: 'https://github.chenc.dev/', best: false },
  { label: 'github.crdz.eu.org', url: 'https://github.crdz.eu.org/', best: false },
  { label: 'gh.llkk.cc', url: 'https://gh.llkk.cc/', best: false },
]

function detectPlatform(name: string): Asset['platform'] {
  const n = name.toLowerCase()
  if (n.includes('windows') || n.includes('win') || n.includes('.msi') || n.includes('.exe')) return 'windows'
  if (n.includes('macos') || n.includes('osx') || n.includes('darwin') || n.includes('.dmg') || n.includes('.tar.gz')) {
    if (n.includes('aarch64') || n.includes('arm64') || n.includes('apple-silicon')) return 'macos-arm'
    return 'macos-intel'
  }
  if (n.includes('linux') || n.includes('.appimage') || n.includes('.deb') || n.includes('.rpm')) return 'linux'
  return undefined
}

function parseBody(body: string): string[] {
  return body.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.trim().replace(/^-\s*/, ''))
}

const FALLBACK_RELEASES: Release[] = [
  { tagName: 'v0.1.1', version: '0.1.1', prerelease: true, publishedAt: '2025-07-10T00:00:00Z', htmlUrl: 'https://github.com/Qomicex-Public/Qomicex.Tauri/releases/tag/v0.1.1', assets: [], changes: ['修复多个 UI 问题', '添加 Vulkan 运行时检查', '优化 macOS DMG 构建'] },
  { tagName: 'v0.1.0', version: '0.1.0', prerelease: false, publishedAt: '2025-06-15T00:00:00Z', htmlUrl: 'https://github.com/Qomicex-Public/Qomicex.Tauri/releases/tag/v0.1.0', assets: [], changes: ['首次公开发布', '支持多版本管理', '支持 Forge/Fabric/Quilt 等加载器', '内置 Modrinth 和 CurseForge 资源浏览', 'Microsoft 账户登录', '内网穿透联机功能'] },
]

let cached: Release[] | null = null

export async function getReleases(): Promise<Release[]> {
  if (cached) return cached
  try {
    const res = await fetch('https://api.github.com/repos/Qomicex-Public/Qomicex.Tauri/releases', {
      headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'Qomicex-Website' },
    })
    if (!res.ok) { cached = FALLBACK_RELEASES; return cached }
    const data: any[] = await res.json()
    if (!Array.isArray(data) || data.length === 0) { cached = FALLBACK_RELEASES; return cached }
    cached = data.map(r => ({
      tagName: r.tag_name,
      version: r.tag_name.replace(/^v/, ''),
      prerelease: r.prerelease,
      publishedAt: r.published_at,
      htmlUrl: r.html_url,
      assets: (r.assets || []).map((a: any) => ({
        name: a.name,
        url: a.browser_download_url,
        platform: detectPlatform(a.name),
      })),
      changes: parseBody(r.body || ''),
    }))
  } catch {
    cached = FALLBACK_RELEASES
  }
  return cached
}

export function mirrorUrl(mirror: string, original: string): string {
  if (!mirror) return original
  return mirror + original
}
