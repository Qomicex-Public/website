// src/lib/ssr-dom-shim.ts
/**
 * 构建期（无 client:* 指令的静态岛）SSR DOM 守卫 — 全站唯一入口。
 *
 * 背景：@qomicex/plugin-ui 的 Card 渲染时经 useMaterial()，其 useState 初始化器直接读
 * document.documentElement。Astro 对不带 client:* 的 React 岛在 Node 端 renderToString，
 * 此时没有 document，会抛 ReferenceError: document is not defined（已冒烟实证）。
 *
 * 方案：仅当 document 缺失（纯服务端）时注入最小桩，覆盖 useMaterial.read() 所需的
 * dataset / style.getPropertyValue；客户端（浏览器真实 document 存在）完全不生效，
 * 且本站岛均为静态渲染、零岛 JS，桩不会在浏览器执行。
 *
 * 用法：凡使用 Card（或其它疑似读 DOM 的库组件）的 .tsx 岛，import 库之前第一行引入本模块：
 *   import '../../lib/ssr-dom-shim';
 *
 * 根治：等 plugin-ui 在 useMaterial 里加 `typeof document` 惰性回退后删除本文件与引用。
 */
if (typeof (globalThis as { document?: unknown }).document === 'undefined') {
  (globalThis as { document?: unknown }).document = {
    documentElement: { dataset: {}, style: { getPropertyValue: () => '' } },
  };
}

export {};
