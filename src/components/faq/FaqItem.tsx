// SSR 静态岛守卫（Badge 用到库组件）
import '../../lib/ssr-dom-shim';
import { Badge } from '@qomicex/plugin-ui';

export interface FaqItemProps {
  question: string;
  answer: string;
}

/**
 * FAQ 单条折叠项 — 用 native <details> 保持零-JS 交互。
 * Badge 用于右上角的「常见问题」标签（如需）；卡片外观通过 className 透传。
 * 构建期静态渲染，零运行时 JS。
 */
export default function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <details className="group rounded-xl border border-border bg-card">
      <summary className="flex cursor-pointer items-center justify-between p-4 font-medium transition-colors hover:text-primary">
        <span>{question}</span>
        <svg
          className="size-4 shrink-0 transition-transform group-open:rotate-180"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <div className="border-t border-border px-4 py-3 text-sm leading-relaxed text-muted-foreground">
        {answer}
      </div>
    </details>
  );
}
