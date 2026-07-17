// ponytail: one-shot fetch, no pagination, no retry
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

const releases = await fetchJSON(`https://api.github.com/repos/${REPO}/releases`, 'releases.json')
const contributors = await fetchJSON(`https://api.github.com/repos/${REPO}/contributors`, 'contributors.json')

const normalized = (releases || []).map(r => ({
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

let totalInstallerDownloads = 0
let updateCheckCount = 0
let releaseCheckCount = 0

if (releases) {
  try {
    const ghapi = await fetchJSON('http://ghapi.qomicex.top/?format=json')
    if (ghapi && typeof ghapi.total === 'number') totalInstallerDownloads = ghapi.total
  } catch {}

  for (const r of releases) {
    for (const a of (r.assets || [])) {
      if (a.name === 'beta.json') updateCheckCount += (a.download_count || 0)
      if (a.name === 'release.json') releaseCheckCount += (a.download_count || 0)
    }
  }
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
