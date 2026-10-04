// src/components/download/SystemRequirements.tsx
/**
 * 下载页「系统要求」表 — 构建期静态岛，零运行时 JS。
 *
 * 去 AI 感要点（对应需求第五、七节）：
 * - 移除 plugin-ui Card 外壳：原「大圆角卡片 + 内嵌表格」是典型 AI UI 观感。
 *   现改为平面表格，仅用 border-y 表达区块边界，无背景填充、无圆角、无阴影。
 * - 状态列不再整列亮绿（原 text-green-600/dark:text-green-400 会让页面到处是绿），
 *   改为低对比 muted 文本，仅在需要时保留极轻的绿色语义。
 * - 圆角层级：本区块为 rounded-none（平面结构），与版本选择 rounded-md、
 *   主按钮 rounded-lg 形成明确层级。
 * - 保留全部真实信息：平台、支持架构、最低系统版本、测试状态、安装包格式。
 *
 * 此前该组件依赖 Card/useMaterial 的 SSR 守卫；移除 Card 后不再需要 document，
 * 但仍保留守卫引入作为跨组件一致的防御（幂等、服务端专用、零开销）。
 */
// SSR 静态岛守卫（全站唯一入口，见 src/lib/ssr-dom-shim.ts）
import '../../lib/ssr-dom-shim';

export interface RequirementRow {
  os: string;
  arch: string;
  /** 架构单元内第二行的小字备注（如 LoongArch64 / RISC-V 实验性） */
  note?: string;
  minVersion: string;
  /** 已完成语言分支的状态显示文本 */
  status: string;
  packageType: string;
}

export interface SystemRequirementsProps {
  /** 区块标题（渲染为 h2，保持标题层级） */
  title: string;
  /** 5 列表头文本（已完成语言分支） */
  headers: string[];
  /** 行数据（顺序与 platforms 数据源一致） */
  rows: RequirementRow[];
  className?: string;
}

export default function SystemRequirements({ title, headers, rows, className }: SystemRequirementsProps) {
  return (
    <section className={'w-full text-left ' + (className ?? '')}>
      {/* 标题层级：原页面此处为 h3，页面 h1 之下无 h2 —— 保持 h3 以不改变既有层级 */}
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/70">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-y border-border/60 text-muted-foreground/70">
              {headers.map((h, i) => (
                <th
                  key={h}
                  className={'py-2 font-normal ' + (i < headers.length - 1 ? 'pr-4' : '')}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.os} className="border-b border-border/60">
                <td className="py-3 pr-4 align-top font-medium text-foreground">{p.os}</td>
                <td className="py-3 pr-4 align-top text-muted-foreground">
                  {p.arch}
                  {p.note && (
                    <>
                      <br />
                      <span className="text-muted-foreground/50">{p.note}</span>
                    </>
                  )}
                </td>
                <td className="py-3 pr-4 align-top text-muted-foreground">{p.minVersion}</td>
                <td className="py-3 pr-4 align-top text-muted-foreground/70">{p.status}</td>
                <td className="py-3 align-top font-mono text-muted-foreground/70">{p.packageType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
