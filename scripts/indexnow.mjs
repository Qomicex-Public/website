// IndexNow 主动推送：把站点 URL 提交给 Bing / Yandex 等支持的搜索引擎，
// 缩短新内容被收录的延迟（替代被动等待爬虫）。
//
// key 文件必须能通过 https://<host>/<key>.txt 访问，且内容等于文件名（去掉 .txt）。
// 本站已存在该文件：public/511e7619b0c04f65824972919a831202.txt
// 因此这里直接复用，不再新建 key（新建会让旧 key 失效并需重新验证所有权）。
//
// 用法：
//   node scripts/indexnow.mjs                 # 优先用本地 dist/sitemap-0.xml，无则拉线上
//   node scripts/indexnow.mjs --live          # 强制读线上 sitemap（CI 部署后使用）
//   node scripts/indexnow.mjs --dry-run       # 只打印将提交的 URL，不发请求
//   node scripts/indexnow.mjs <url> [...]     # 仅提交指定 URL
//
// 该脚本不挂在 build 上，避免每次构建都向外发请求（构建环境可能无网络/
// 不应有副作用）。由 .github/workflows/vercel-redeploy.yml 在「部署成功之后」
// 调用——顺序很重要：部署完成前提交，搜索引擎抓到的是 404，会损害收录信任度。

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const HOST = 'www.qomicex.top'
const KEY_FILE = resolve(ROOT, 'public/511e7619b0c04f65824972919a831202.txt')

const ARGS = process.argv.slice(2)
const LIVE = ARGS.includes('--live')
const DRY_RUN = ARGS.includes('--dry-run')

if (!existsSync(KEY_FILE)) {
  console.error(`✗ 缺少 IndexNow key 文件: public/511e7619b0c04f65824972919a831202.txt`)
  process.exit(1)
}
const KEY = readFileSync(KEY_FILE, 'utf-8').trim()
if (KEY !== '511e7619b0c04f65824972919a831202') {
  console.error(`✗ key 文件内容(${KEY})与文件名不一致，IndexNow 会校验失败`)
  process.exit(1)
}

/** 带重试的 GET：CI 中紧随部署完成，边缘节点可能还差几秒才稳定 */
async function fetchText(url, tries = 3, delayMs = 5000) {
  let lastErr
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } })
      if (res.ok) return await res.text()
      lastErr = new Error(`HTTP ${res.status}`)
    } catch (e) {
      lastErr = e
    }
    if (i < tries) {
      console.log(`  第 ${i} 次获取失败(${lastErr.message})，${delayMs / 1000}s 后重试…`)
      await new Promise((r) => setTimeout(r, delayMs))
    }
  }
  throw new Error(`获取 ${url} 失败: ${lastErr.message}`)
}

/** 从 sitemap 文本里抽出全部 <loc> */
function locs(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
}

/** 线上 sitemap（index → 子 sitemap）展开为完整 URL 列表 */
async function collectFromLive() {
  const idx = await fetchText(`https://${HOST}/sitemap-index.xml`)
  const urls = []
  for (const sm of locs(idx)) {
    const xml = await fetchText(sm)
    urls.push(...locs(xml))
  }
  return urls
}

async function collectUrls() {
  // 显式传入 URL 时优先，便于人工补推单页
  const argv = ARGS.filter((a) => a.startsWith('http'))
  if (argv.length > 0) return argv

  // --live：强制取线上 sitemap。部署后线上已是本次产物，
  // 用它可保证提交的 URL 与线上完全一致。
  if (LIVE) return collectFromLive()

  const local = resolve(ROOT, 'dist/sitemap-0.xml')
  if (existsSync(local)) return locs(readFileSync(local, 'utf-8'))

  console.log('未找到本地 dist/sitemap-0.xml，回退读取线上 sitemap')
  return collectFromLive()
}

const urlList = [...new Set(await collectUrls())]
if (urlList.length === 0) {
  console.error('✗ 未取得任何 URL，请先 npm run build 或显式传入 URL')
  process.exit(1)
}

// 递交前校验：URL 必须属于本站 host，否则 IndexNow 返回 422
const foreign = urlList.filter((u) => {
  try {
    return new URL(u).host !== HOST
  } catch {
    return true
  }
})
if (foreign.length > 0) {
  console.error(`✗ 以下 URL 不属于 ${HOST}，IndexNow 会拒绝:`)
  foreign.slice(0, 5).forEach((u) => console.error(`   ${u}`))
  process.exit(1)
}

console.log(`准备提交 ${urlList.length} 个 URL 到 IndexNow (${HOST})`)

if (DRY_RUN) {
  console.log('--dry-run 已启用，仅列出将提交的 URL（不发请求）:')
  urlList.forEach((u) => console.log(`   ${u}`))
  process.exit(0)
}

// IndexNow 单次上限 10000 条；本站远小于此，一次提交
const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList,
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
})

// 200/202 = 接受；其他码含义见 https://www.indexnow.org/documentation
if (res.status === 200) console.log('✓ 提交成功 (200 OK)')
else if (res.status === 202) console.log('✓ 已接受，待处理 (202 Accepted)')
else {
  const text = await res.text().catch(() => '')
  console.error(`✗ 提交失败 HTTP ${res.status}${text ? ' — ' + text.slice(0, 300) : ''}`)
  if (res.status === 403) console.error('  提示：key 文件不可访问或内容不匹配')
  if (res.status === 422) console.error('  提示：URL 不属于该 host 或格式有误')
  process.exit(1)
}

console.log(`已提交: ${urlList.slice(0, 3).join(', ')}${urlList.length > 3 ? ` … (+${urlList.length - 3})` : ''}`)
