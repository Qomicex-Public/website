// SSR 中心守卫（主会话约定，W3 实证崩溃点）：必须置于库 import 之前。
// 本岛当前只用 Button（不读 document），接入纯属防御——未来若改用 Card 不回退。
import '../../lib/ssr-dom-shim';
import { Button } from '@qomicex/plugin-ui';

export interface CtaButtonProps {
  /**
   * 保留原 id 供 vanilla 脚本事件委托（#dl-btn / #dl-pre-btn）。
   * 岛为构建期静态渲染，输出真实 <button>，DOMContentLoaded 后与手写 HTML 无差。
   */
  id: string;
  label: string;
  /** hero = 绿底主下载按钮（variant default）；pre = 「下载测试版」文字链（variant ghost） */
  kind: 'hero' | 'pre';
}

/**
 * 首页下载 CTA — plugin-ui Button 静态岛，零运行时 JS。
 *
 * 视觉口径（去除「AI 感」发光，与下载页 CTA 统一）：
 * - hero 主按钮用品牌绿 bg-primary（= global.css --primary 142 71% 48%），
 *   不再使用硬编码 green-500；去掉 shadow-lg/shadow-green-500/30 光晕、
 *   hover:shadow-xl、hover:-translate-y-0.5 位移与 active:scale 缩放，
 *   只保留 background 过渡（transition-colors），尺寸由 h-14→h-12、rounded-xl→rounded-lg 收敛。
 * - 原类名整体经 className 传入，tailwind-merge 覆盖基类冲突项。
 * - 基类残留但视觉无影响的项：whitespace-nowrap、duration-150、px-4 py-2、
 *   disabled:*（永不禁用）、[&_svg]:pointer-events-none/shrink-0。
 * - focus-visible 键盘聚焦时显示组件库绿环（与 W1 Header.tsx 一致的组件语义）。
 * - hero 图标内联 JSX svg（Header.tsx 先例），几何精确复制 astro-icon 的 lucide:download。
 */
export default function CtaButton({ id, label, kind }: CtaButtonProps) {
  if (kind === 'hero') {
    return (
      <Button
        id={id}
        variant="default"
        className="h-11 w-full max-w-xs cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 [&_svg]:size-4"
      >
        <svg width="1em" height="1em" viewBox="0 0 24 24" className="size-4">
          <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
            <path d="M12 15V3m9 12v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m7 10l5 5l5-5" />
          </g>
        </svg>
        {label}
      </Button>
    );
  }
  return (
    <Button
      id={id}
      variant="ghost"
      className="h-auto cursor-pointer px-0 py-0 font-normal text-xs text-slate-400 underline underline-offset-2 transition-colors hover:bg-transparent hover:text-white active:scale-100"
    >
      {label}
    </Button>
  );
}
