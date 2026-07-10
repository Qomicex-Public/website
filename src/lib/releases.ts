export interface Release {
  tagName: string
  version: string
  prerelease: boolean
  publishedAt: string
  htmlUrl: string
  changes: string[]
}

const FALLBACK_RELEASES: Release[] = [
  { tagName: 'v0.1.1', version: '0.1.1', prerelease: true, publishedAt: '2025-07-10T00:00:00Z', htmlUrl: 'https://github.com/Qomicex-Public/Qomicex.Tauri/releases/tag/v0.1.1', changes: ['修复多个 UI 问题', '添加 Vulkan 运行时检查', '优化 macOS DMG 构建'] },
  { tagName: 'v0.1.0', version: '0.1.0', prerelease: false, publishedAt: '2025-06-15T00:00:00Z', htmlUrl: 'https://github.com/Qomicex-Public/Qomicex.Tauri/releases/tag/v0.1.0', changes: ['首次公开发布', '支持多版本管理', '支持 Forge/Fabric/Quilt 等加载器', '内置 Modrinth 和 CurseForge 资源浏览', 'Microsoft 账户登录', '内网穿透联机功能'] },
]

let cached: Release[] | null = null

function parseBody(body: string): string[] {
  return body.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.trim().replace(/^-\s*/, ''))
}

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
      changes: parseBody(r.body || ''),
    }))
  } catch {
    cached = FALLBACK_RELEASES
  }
  return cached
}

export async function getLatestStable(): Promise<Release | undefined> {
  const releases = await getReleases()
  return releases.find(r => !r.prerelease)
}

export async function getLatestPrerelease(): Promise<Release | undefined> {
  const releases = await getReleases()
  return releases.find(r => r.prerelease)
}
