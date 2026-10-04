// SSR 静态岛守卫（全站唯一入口，见 src/lib/ssr-dom-shim.ts）
import '../../lib/ssr-dom-shim';

export interface VersionOption {
  /** 稳定标识，供脚本选择：stable | pre */
  id: string;
  /** 展示名：正式版 / 测试版 */
  title: string;
  /** 版本号，如 v0.1.0-release1.0 */
  version: string;
  /** 发布日期 YYYY-MM-DD */
  date: string;
  /** 辅助标识（仅测试版给 Beta） */
  tag?: string;
  /** 是否默认选中 */
  selected: boolean;
}

export interface VersionSelectorProps {
  /** 区块小标题：版本 */
  label: string;
  /** 选中项右侧文案：当前选择 */
  currentLabel: string;
  options: VersionOption[];
}

/**
 * 下载页「版本选择器」— 构建期静态岛，零运行时 JS。
 *
 * 设计取向（去 AI 模板感，对齐真实软件发行页）：
 * - 放弃 SaaS 式彩色卡片：无 Card 外壳、无 shadow、无彩色边框、无发光。
 * - 改为克制的纵向列表：左侧竖线 + 极浅品牌绿底表示选中，rounded-md 小圆角。
 * - 选中态完全由 CSS 表达（Tailwind `data-[selected=true]` / `group-data-[selected=true]` 变体），
 *   壳层脚本只需切换 `data-selected` 属性，无需拼 className 字符串——
 *   原下载页脚本用字符串拼接重建整个 className，易与 Tailwind 冲突且易漏项。
 * - 语义用 role="listbox"/option 表达「这里是在选择下载版本」，配合 aria-selected。
 * - 版本号、发布日期、类型三者保持独立可读，不依赖颜色区分。
 */
export default function VersionSelector({ label, currentLabel, options }: VersionSelectorProps) {
  return (
    <div className="w-full text-left">
      <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">{label}</div>
      <div
        role="listbox"
        aria-label={label}
        id="ver-list"
        className="divide-y divide-border/60 border-y border-border/60"
      >
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="option"
            data-ver={o.id}
            aria-selected={o.selected ? 'true' : 'false'}
            data-selected={o.selected ? 'true' : 'false'}
            className="group flex w-full cursor-pointer items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-accent/40 data-[selected=true]:bg-primary/[0.04]"
          >
            {/* 选中指示：左侧竖线 */}
            <span
              aria-hidden="true"
              className="w-0.5 self-stretch rounded-full bg-transparent group-data-[selected=true]:bg-primary"
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-muted-foreground group-data-[selected=true]:text-foreground">
                  {o.title}
                </span>
                {o.tag && (
                  <span className="rounded-sm border border-border px-1 py-px text-[10px] font-normal leading-none text-muted-foreground/70">
                    {o.tag}
                  </span>
                )}
              </span>
              <span className="mt-0.5 block font-mono text-xs text-muted-foreground/70">{o.version}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-xs text-muted-foreground/70">{o.date}</span>
              {/* 「当前选择」仅选中项可见（未选中项用 text-transparent 占位避免行高跳动）。
                  aria-hidden：选中语义已由 aria-selected 表达，否则屏幕阅读器会把
                  未选中项也读成「当前选择」。 */}
              <span
                aria-hidden="true"
                className="mt-0.5 block text-[11px] text-transparent group-data-[selected=true]:text-primary"
              >
                {currentLabel}
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
