// ponytail: one-shot fetch, paginated (GitHub caps per_page at 100), no retry
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../src/data')
const REPO = 'Qomicex-Public/Qomicex.Tauri'
const HEADERS = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'Qomicex-SiteBuilder' }

mkdirSync(DATA_DIR, { recursive: true })

async function fetchJSON(url, fallbackFile) {
  try {
    const res = await fetch(url, { headers: HEADERS })
    if (res.ok) return await res.json()
  } catch {}
  const path = resolve(DATA_DIR, fallbackFile)
  if (existsSync(path)) {
    const raw = readFileSync(path, 'utf-8')
    return JSON.parse(raw)
  }
  return null
}

// GitHub 的 /releases 默认只返回 30 条。正式版可能被后续大量 beta 挤到 30 名之外
// （本站实测：正式版 v0.1.0-release1.0 在 80 条中排第 45 位），导致前端取不到
// prerelease=false 的版本、下载按钮退化为跳 GitHub release 页。
// 这里用 per_page=100 并跟随 Link 头的 rel="next" 翻页取全，杜绝截断。
async function fetchAllReleases(url) {
  const out = []
  let next = `${url}?per_page=100`
  for (let page = 0; page < 20 && next; page++) {
    let res
    try {
      res = await fetch(next, { headers: HEADERS })
    } catch {
      break
    }
    if (!res.ok) break
    const batch = await res.json()
    if (!Array.isArray(batch)) break
    out.push(...batch)
    const link = res.headers.get('link') || ''
    const m = link.match(/<([^>]+)>;\s*rel="next"/)
    next = m ? m[1] : null
  }
  if (out.length > 0) return out
  return null
}

function detectPlatform(name) {
  const n = name.toLowerCase()
  if (n.includes('windows') || n.includes('win') || n.includes('.msi') || n.includes('.exe')) return 'windows'
  if (n.includes('macos') || n.includes('osx') || n.includes('darwin') || n.includes('.dmg') || n.includes('.tar.gz')) {
    if (n.includes('aarch64') || n.includes('arm64') || n.includes('apple-silicon')) return 'macos-arm'
    return 'macos-intel'
  }
  if (n.includes('linux') || n.includes('.appimage') || n.includes('.deb') || n.includes('.rpm')) return 'linux'
  return undefined
}

const rawReleases = await fetchAllReleases(`https://api.github.com/repos/${REPO}/releases`)
const contributors = await fetchJSON(`https://api.github.com/repos/${REPO}/contributors`, 'contributors.json')

// rawReleases 为 GitHub 原始结构（tag_name/body/...）；若抓取全失败则回退到
// 上次已归一化的缓存（结构为 tagName/version/...），此时跳过归一化直接复用，
// 避免网络抖动把线上版本列表清空，也避免对已归一化数据二次归一化产出空值。
let normalized
if (rawReleases) {
  normalized = (rawReleases || []).filter(r => !r.prerelease || (r.tag_name || '').toLowerCase().includes('beta')).map(r => ({
    tagName: r.tag_name,
    version: r.tag_name.replace(/^v/, ''),
    prerelease: r.prerelease,
    publishedAt: r.published_at,
    htmlUrl: r.html_url,
    assets: (r.assets || []).map(a => ({
      name: a.name,
      url: a.browser_download_url,
      platform: detectPlatform(a.name),
    })),
    changes: (r.body || '').split('\n').filter(l => l.trim().startsWith('-')).map(l => l.trim().replace(/^-\s*/, '')),
  }))
} else {
  const cached = await fetchJSON('', 'releases.json')
  normalized = Array.isArray(cached) ? cached : []
  console.warn(`! GitHub releases fetch failed; reusing cached releases.json (${normalized.length} entries)`)
}

let totalInstallerDownloads = 0
let updateCheckCount = 0
let releaseCheckCount = 0

if (normalized.length > 0) {
  try {
    const ghapi = await fetchJSON('http://ghapi.qomicex.top/?format=json')
    if (ghapi && typeof ghapi.total === 'number') totalInstallerDownloads = ghapi.total
  } catch {}

  try {
    const res = await fetch('https://img.shields.io/github/downloads/Qomicex-Public/Qomicex.Tauri/total.json')
    if (res.ok) {
      const shields = await res.json()
      if (shields?.message) updateCheckCount = shields.message
    }
  } catch {}
}

writeFileSync(resolve(DATA_DIR, 'releases.json'), JSON.stringify(normalized, null, 2))
writeFileSync(resolve(DATA_DIR, 'contributors.json'), JSON.stringify(contributors || [], null, 2))
writeFileSync(resolve(DATA_DIR, 'last-fetch.json'), JSON.stringify({
  updatedAt: new Date().toISOString(),
}))
writeFileSync(resolve(DATA_DIR, 'stats.json'), JSON.stringify({
  totalInstallerDownloads,
  updateCheckCount,
  releaseCheckCount,
  updatedAt: new Date().toISOString(),
}))

console.log(`✓ Fetched ${normalized.length} releases, ${(contributors || []).length} contributors, downloads: ${totalInstallerDownloads}`)
