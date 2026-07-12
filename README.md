# Qomicex Launcher 官方网站

https://www.qomicex.top/

基于 Astro 构建，使用 Tailwind CSS 和纯前端 JavaScript。

## 本地开发

```bash
npm install
npm run dev
```

## 编辑文档

文档内容位于 `src/content/docs/` 目录，每个 `.md` 文件对应一个文档页面。

### 新建一篇文档

在 `src/content/docs/` 下创建 `.md` 文件，文件名即 URL 路径：

```
src/content/docs/
├── install.md          → /docs/install/
├── setup-java.md       → /docs/setup-java/
└── ...
```

文件格式：

```markdown
---
title: 文档标题
category: 快速开始    # 所属分类
order: 1              # 排序序号（越小越靠前）
---

正文内容使用 Markdown 编写。
```

### 注意事项

- 有序/无序列表使用标准 Markdown 语法（`1.` / `-`）
- 代码使用反引号 `` `code` ``
- 如需使用信息框、卡片网格等自定义样式，直接写 HTML：

  ```html
  <div class="rounded-lg border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
  **提示：**一些提示内容。
  </div>
  ```

  可用的样式类见 `src/layouts/DocsLayout.astro` 中的 CSS 规则。

### 文档结构

文档分类和排序由 `.md` 文件的 `category` 和 `order` 字段控制：

- **快速开始：** 下载与安装、设置 Java、添加账户、创建实例
- **核心功能：** 管理模组与资源、资源中心、启动游戏、联机功能、版本隔离

需要调整顺序只需修改 `order` 值，无需改动代码。

---

[爱发电](https://ifdian.net/a/QomicexLauncher)
