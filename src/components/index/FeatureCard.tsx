// SSR 中心守卫（主会话约定，W3 实证崩溃点）：必须置于库 import 之前。
// 本岛当前只用 Badge（不读 document），接入纯属防御——未来若改用 Card 不回退。
import '../../lib/ssr-dom-shim';
import { Badge } from '@qomicex/plugin-ui';

export interface FeatureCardProps {
  title: string;
  desc: string;
  tags: string[];
}

/**
 * 首页特性块「文本侧」（标题 / 描述 / 标签胶囊）— 构建期静态渲染岛，零运行时 JS。
 *
 * 设计决策（W2，与 astro 壳层协作）：
 * - icon 芯片（astro-icon）留在 astro 侧渲染（优先方案：Icon 无法进 React 岛）；
 * - 不使用 plugin-ui Card 组：
 *   1) Card 依赖 useMaterial，其 useState 初始化器在渲染期直接读取 document，
 *      astro build 的静态渲染（renderToString）会抛 ReferenceError（已实测），
 *      违反「零 client:* / 构建期可静态渲染」硬指标；
 *   2) 首页特性区是无边框全幅横排，Card 的 rounded-xl border bg-card shadow
 *      会引入原设计没有的卡片外观，违反视觉保真；
 *   3) CardTitle 渲染 <div>，会破坏原 h2 标题层级。
 * - tags 用 Badge(variant=outline)：原胶囊类名经 tailwind-merge 全覆盖，
 *   并用 style={{ animation: 'none' }} 压掉 Badge 基类的 animate-zoom-fade-in
 *   （原设计无入场动画；inline style 优先级确定，不依赖 CSS 排序）。
 * - data-animate 钩子与 transition-delay（80/160/240ms）与原样一致。
 */
export default function FeatureCard({ title, desc, tags }: FeatureCardProps) {
  return (
    <>
      <h2 data-animate className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl" style={{ transitionDelay: '80ms' }}>
        {title}
      </h2>
      <p data-animate className="mb-5 text-sm leading-relaxed text-muted-foreground sm:text-base" style={{ transitionDelay: '160ms' }}>
        {desc}
      </p>
      <div data-animate className="flex flex-wrap gap-2" style={{ transitionDelay: '240ms' }}>
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="rounded-full border-border bg-background px-2.5 py-1 text-[11px] font-normal text-muted-foreground"
            style={{ animation: 'none' }}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </>
  );
}
