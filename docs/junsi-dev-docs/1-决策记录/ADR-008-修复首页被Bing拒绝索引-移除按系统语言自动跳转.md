# ADR-008：修复首页被 Bing 拒绝索引：移除按系统语言自动跳转 / → /en/

| 属性 | 内容 |
|---|---|
| 状态 | 已采纳 |
| 日期 | 2026-10-07 |
| 决策者 | AI Agent |

## 背景

现象：Bing Webmaster Tools「URL 检查 → 必应索引」对 https://www.qomicex.top/ 显示「未进行索引编制，因为此页面是重定向页面，该 URL 无法在必应上显示」，规范 URL 为 `- -`；而 https://www.qomicex.top/en/ 与 /download/ 均为「已成功编制索引」。site: 查询中首页长期无有效收录。

排查与证据（分档）：
- 已排除项（已证明）：服务端无 3xx（/ 与 /index.html 均 200，apex→www 单跳 308 正常）；robots.txt `Allow: /` 仅 Disallow /api/；无 x-robots-tag；sitemap-index.xml → sitemap-0.xml 共 14 个 URL 且 Bing 侧「成功」；阻止 URL 为 0 条；IndexNow 已提交 57 条；canonical/hreflang/x-default 标签本身正确。
- 已证明根因：src/layouts/Base.astro 的 <head> 内联脚本在「未表达语言偏好且 navigator.language 以 en 开头」时执行 `location.replace('/en/')`。爬虫（bingbot / Googlebot）的 Accept-Language 通常为英文，因此访问 / 必然被 JS 弹到 /en/，Bing 由此把 / 认定为一个指向 /en/ 的重定向页并拒绝索引。用 Playwright 覆写 locale=en-US 并以 bingbot UA 访问线上 /，framenavigated 捕获到 / → /en/，且 localStorage['qml-lang'] 为 null。
- 对照实验：/en/ 与 /download/ 不含该分支（脚本条件限定 pathname === '/'），故正常索引。

该脚本最初为「英文系统用户首访自动进入英文站」而加，并在 ADR-005 中为修复「英文系统无法切回中文」的死循环而改为读 localStorage；但「未表达偏好时按系统语言导流」这一分支始终对爬虫不可见地变更了页面地址，ADR-005 当时未评估其 SEO 后果。

## 决策

移除按系统语言自动导流的分支，语言跳转只响应用户的显式选择：

```js
var chosen = null
try { chosen = localStorage.getItem('qml-lang') } catch (e) { chosen = null }
if (chosen === 'zh') return
if (chosen === 'en') {
  if (location.pathname === '/' || location.pathname === '') location.replace('/en/')
}
```

即：`navigator.language` 不再参与任何跳转决策。爬虫的 localStorage 恒为空，故两个分支对搜索引擎不可见；而 ADR-005 要保住的「显式选择优先」依然成立（用户点过语言切换后写入 qml-lang，之后不再被覆盖）。

权衡取舍：英文系统的新访客不再自动进入 /en/，会先看到中文首页，可通过顶栏 EN 切换。以「首访自动跳转」换取「首页可被索引」是本次的明确取舍——首页是权重最高的入口页，其不可索引的代价远大于一次手动切换。

修复后验证（以 bingbot UA + en-US 访问线上）：导航记录仅 / 一次，不再出现 /en/；Bing 实时 URL 测试返回「该 URL 可以由必应编制索引」。

## 备选方案

### 方案 按爬虫 UA 特判跳过跳转（cloaking）
- 优点：保留英文用户首访自动导流体验
- 缺点：对爬虫与真人返回不同行为属 cloaking，违反搜索引擎规范，可能触发降权；维护 UA 黑名单不可持续
- 为何不选：用违规手段换体验不可接受，且风险远大于收益

### 方案 改用 <meta http-equiv="refresh"> 做首访导流
- 优点：无需 JS，兼容性广
- 缺点：meta refresh 同样被引擎判定为重定向，首页仍会被拒绝索引；且跳转更慢、影响可用性
- 为何不选：不解决根因，只是换个形式触发同一判定

### 方案 用 301 把 / 永久重定向到 /en/
- 优点：服务端重定向语义明确，Bing 会在 /en/ 正常索引
- 缺点：等于放弃中文首页作为主入口——中文用户与 zh-CN hreflang 失去落点，站点默认语言被颠倒
- 为何不选：与站点以中文为默认语言的定位冲突，代价过大

### 方案 保持自动导流，改为主推 /en/ 作为索引入口
- 优点：零代码改动
- 缺点：sitemap 与 canonical 均声明 / 为主入口，与索引现实不一致；首页收录问题依旧
- 为何不选：绕开而非修复，且与既有 canonical 声明自相矛盾

## 影响
- src/layouts/Base.astro：<head> 语言导流脚本删除 navigator.language 分支（提交 d5233d1，10 改 10）
- 全站 35 页共用该布局，但仅首页 / 的自动跳转行为改变；其余页面本就不参与导流（条件限定 pathname === '/'）
- SEO：/ 恢复可索引资格，canonical 不再被 JS 跳转旁路；sitemap 与 canonical 对 / 的声明重新与索引现实一致
- i18n 体验回归：英文系统新访客不再自动进入 /en/，需通过顶栏 EN 手动切换；用户显式选择（qml-lang）仍被尊重，ADR-005 的死循环修复未被回退
- 后续运维：需在 Bing Webmaster Tools 对 / 重新请求编制索引（已提交），并等待下一次爬网以刷新「必应索引」缓存（排查时该缓存仍为修复前的 17:20 抓取结果）

## 修订记录
| 日期 | 版本 | 修改内容 | 修改人 |
|---|---|---|---|
| 2026-10-07 | v1.0 | 初版创建 | AI Agent |