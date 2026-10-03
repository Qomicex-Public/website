import { Button } from '@qomicex/plugin-ui';

export interface DownloadButtonProps {
  /** 下载地址（由 .astro 壳层取 releases 数据后传入，保持展示组件无副作用） */
  href: string;
  label?: string;
  platform?: string;
}

/**
 * 官网统一下载 CTA — 基于 QML 官方组件库 Button（asChild 渲染为 <a>，外链语义不变）。
 * 无 client:* 指令时构建期静态渲染，零运行时 JS。
 */
export default function DownloadButton({ href, label = '下载', platform }: DownloadButtonProps) {
  return (
    <Button asChild size="lg" className="gap-2">
      <a href={href} target="_blank" rel="noopener">
        <span>{label}</span>
        {platform && <span className="text-xs opacity-70">({platform})</span>}
      </a>
    </Button>
  );
}
