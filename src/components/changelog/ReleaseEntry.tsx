// SSR 静态岛守卫（Card 渲染需要。见 src/lib/ssr-dom-shim.ts）
import '../../lib/ssr-dom-shim';
import { Badge } from '@qomicex/plugin-ui';

export interface ReleaseEntryProps {
  version: string;
  date: string;
  isPrerelease: boolean;
  prereleaseLabel: string;
  changes: string[];
  changesLabel: string;
  detailLabel: string;
  detailUrl: string;
}

/**
 * 更新日志 — 单条版本记录。
 * 卡片外观由 astro 侧 class="rounded-xl border border-border bg-card p-5" 包裹，
 * Badge 用于测试版标签，Button(asChild) 用于「查看详情」链接。
 * 构建期静态渲染，零运行时 JS。
 */
export default function ReleaseEntry({
  version,
  date,
  isPrerelease,
  prereleaseLabel,
  changes,
  changesLabel,
  detailLabel,
  detailUrl,
}: ReleaseEntryProps) {
  return (
    <>
      {/* 版本标题行 */}
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="text-lg font-semibold">v{version}</h2>
        <span className="text-xs text-muted-foreground">{date}</span>
        {isPrerelease && (
          <Badge
            variant="outline"
            className="rounded-full border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-600 dark:text-yellow-400"
          >
            {prereleaseLabel}
          </Badge>
        )}
      </div>
      {/* 更新内容列表 */}
      <ul className="space-y-1 text-sm text-muted-foreground">
        {changes.length > 0
          ? changes.map((c, i) => <li key={i}>• {c}</li>)
          : <li className="italic opacity-60">{changesLabel}</li>}
      </ul>
      {/* 查看详情链接 */}
      <a
        href={detailUrl}
        target="_blank"
        rel="noopener"
        className="mt-3 inline-block text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
      >
        {detailLabel}
      </a>
    </>
  );
}
