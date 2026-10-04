// IndexNow 主动推送：把站点 URL 提交给 Bing / Yandex 等支持的搜索引擎，
// 缩短新内容被收录的延迟（替代被动等待爬虫）。
//
// key 文件必须能通过 https://<host>/<key>.txt 访问，且内容等于文件名（去掉 .txt）。
// 本站已存在该文件：public/511e7619b0c04f65824972919a831202.txt
// 因此这里直接复用，不再新建 key（新建会让旧 key 失效并需重新验证所有权）。
//
// 用法：
//   node scripts/indexnow.mjs              # 提交 sitemap 中的全部 URL
//   node scripts/indexnow.mjs <url> [...]  # 仅提交指定 URL
//
// 该脚本不参与 build，避免每次构建都向外发请求（构建环境可能无网络/
// 不应有副作用）。需要时手动执行或在部署后由 CI 单独调用。

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const HOST = 'www.qomicex.top'
const KEY_FILE = resolve(ROOT, 'public/511e7619b0c04f65824972919a831202.txt')

if (!existsSync(KEY_FILE)) {
  console.error(`✗ 缺少 IndexNow key 文件: public/511e7619b0c04f65824972919a831202.txt`)
  process.exit(1)
}
const KEY = readFileSync(KEY_FILE, 'utf-8').trim()
if (KEY !== '511e7619b0c04f65824972919a831202') {
  console.error(`✗ key 文件内容(${KEY})与文件名不一致，IndexNow 会校验失败`)
  process.exit(1)
}

// 取待提交 URL：命令行参数优先，否则从构建产物 sitemap 读取
async function collectUrls() {
  const argv = process.argv.slice(2).filter(a => a.startsWith('http'))
  if (argv.length > 0) return argv

  const local = resolve(ROOT, 'dist/sitemap-0.xml')
  if (existsSync(local)) {
    const xml = readFileSync(local, 'utf-8')
    return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
  }
  // 回退：拉线上 sitemap
  const idx = await (await fetch(`https://${HOST}/sitemap-index.xml`)).text()
  const sm = [...idx.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
  const urls = []
  for (const s of sm) {
    const xml = await (await fetch(s)).text()
    urls.push(...[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]))
  }
  return urls
}

const urlList = [...new Set(await collectUrls())]
if (urlList.length === 0) {
  console.error('✗ 未取得任何 URL，请先 npm run build 或显式传入 URL')
  process.exit(1)
}

console.log(`准备提交 ${urlList.length} 个 URL 到 IndexNow (${HOST})`)

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
