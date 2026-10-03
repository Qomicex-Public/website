// SSR 中心守卫（主会话约定，W3 实证崩溃点）：必须置于库 import 之前。
// 本岛当前只用 Badge（不读 document），接入纯属防御——未来若改用 Card 不回退。
import '../../lib/ssr-dom-shim';
import { Badge } from '@qomicex/plugin-ui';

export interface StatBadgeProps {
  /** 药丸完整文本，由 astro 壳层拼好传入（版本 · 平台 · 下载数），JSON 可序列化 */
  text: string;
}

/**
 * Hero 数字药丸（v版本 · 全平台/All Platforms · 总下载 N 次）— Badge 静态岛，零运行时 JS。
 *
 * - 原 <span> 为内联 flex 容器，Badge 渲染 <div>（同为 inline-flex items-center），
 *   位于 flex-col 容器中作为 flex item，盒模型一致，视觉无差。
 * - 图标嵌套在药丸内部，无法留在 astro 侧 → 按 Header.tsx 先例内联 JSX svg，
 *   几何与属性精确复制 astro-icon 渲染的 lucide:tag（@iconify-json/lucide）：
 *   width/height="1em" + class="size-3"，与原始输出同尺寸同描边。
 * - Badge 基类 animate-zoom-fade-in（原设计无入场动画）用 inline style 压掉，
 *   其余差异类名（rounded-md/font-semibold/px-2.5/py-0.5/text-foreground）
 *   均被 className 覆盖（tailwind-merge 实测验证）。
 * - border-primary/30、bg-primary/10、text-green-400、mb-4、gap-1.5 原样保留。
 */
export default function StatBadge({ text }: StatBadgeProps) {
  return (
    <Badge
      variant="outline"
      className="mb-4 gap-1.5 rounded-full border-primary/30 bg-primary/10 px-3 py-1 font-medium text-green-400"
      style={{ animation: 'none' }}
    >
      <svg width="1em" height="1em" viewBox="0 0 24 24" className="size-3">
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
          <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
        </g>
      </svg>
      {text}
    </Badge>
  );
}
