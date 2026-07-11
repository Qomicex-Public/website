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

let cached: Release[] | null = null

export async function getReleases(): Promise<Release[]> {
  if (cached) return cached
  try {
    const res = await fetch('https://api.github.com/repos/Qomicex-Public/Qomicex.Tauri/releases', {
      headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'Qomicex-Website' },
    })
    if (!res.ok) { cached = []; return cached }
    const data: any[] = await res.json()
    if (!Array.isArray(data) || data.length === 0) { cached = []; return cached }
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
    cached = []
  }
  return cached
}
