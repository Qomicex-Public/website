// src/components/download/CompatibilityCard.tsx
/**
 * 下载页「兼容平台」卡片 — plugin-ui Card 壳 + 卡片内静态表格。
 *
 * 卡片外壳（rounded-xl border-border bg-card p-5）改由库 Card 组合（CardHeader/CardContent），
 * 表格 DOM 与类名逐字保留原页面写法（无交互、无 id/class 脚本依赖，数据由 .astro frontmatter
 * 取 platforms + i18n 后以可序列化 props 传入；文案在 frontmatter 完成 lang 分支，组件内零逻辑）。
 *
 * 标题层级保持 h3 手写：库 CardTitle 渲染 <div>，若用它承载原 <h3> 会改变标题层级（铁律禁止）。
 * 构建期静态渲染，零运行时 JS（Card 的 SSR document 守卫见 PlatformCard.tsx 同注释）。
 */
// SSR 静态岛守卫（全站唯一入口，见 src/lib/ssr-dom-shim.ts；服务端专用、幂等）
import '../../lib/ssr-dom-shim';
import { Card, CardContent, CardHeader, cn } from '@qomicex/plugin-ui';

export interface CompatibilityRow {
  os: string;
  arch: string;
  /** 架构单元内第二行的小字备注（可缺省） */
  note?: string;
  minVersion: string;
  /** 已完成语言分支的状态显示文本 */
  status: string;
  packageType: string;
}

export interface CompatibilityCardProps {
  /** 卡片标题（渲染为 h3，保持原页面标题层级） */
  title: string;
  /** 5 列表头文本（已完成语言分支） */
  headers: string[];
  /** 行数据（顺序与 platforms 数据源一致） */
  rows: CompatibilityRow[];
  className?: string;
}

export default function CompatibilityCard({ title, headers, rows, className }: CompatibilityCardProps) {
  // 注意：原卡片外层 div 未声明 text-align —— 标题 h3 继承页面 hero 容器的 text-center，
  // 表格自身 text-left；因此这里不能加 text-left，保持标题居中的原始视觉。
  return (
    <Card className={cn('mt-10 w-full p-5 shadow-none', className)}>
      <CardHeader className="p-0">
        {/* 原页面此处为 h3（非 CardTitle）——标题层级不允许变化 */}
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto text-sm">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                {headers.map((h, i) => (
                  <th key={h} className={i < headers.length - 1 ? 'py-2 pr-3 font-medium' : 'py-2 font-medium'}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {rows.map((p, i) => (
                <tr key={p.os} className={i < rows.length - 1 ? 'border-b border-border/50' : ''}>
                  <td className="py-2.5 pr-3 font-medium text-foreground">{p.os}</td>
                  <td className="py-2.5 pr-3">
                    {p.arch}
                    {p.note && (
                      <>
                        <br />
                        <span className="text-muted-foreground/60">{p.note}</span>
                      </>
                    )}
                  </td>
                  <td className="py-2.5 pr-3">{p.minVersion}</td>
                  <td className="py-2.5 pr-3">
                    <span className="text-green-600 dark:text-green-400">{p.status}</span>
                  </td>
                  <td className="py-2.5">{p.packageType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
