import { Separator } from '@qomicex/plugin-ui';

export interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface FooterProps {
  copyright: string;
  links: FooterLink[];
  downloadsText: string;
  usageText: string;
  dataUpdatedText: string;
  dataUpdatedDate: string;
}

/**
 * 官网页脚 — plugin-ui Separator 原语重构（顶部水平分割线替代手写 border-t）。
 * 小字文本链接保持纯 <a> + 语义类（muted-foreground / hover:text-foreground），
 * 不套 Button，视觉与原 Footer.astro 完全一致。
 * 构建期静态渲染，无 hydration、零运行时 JS。
 */
export default function Footer({
  copyright,
  links,
  downloadsText,
  usageText,
  dataUpdatedText,
  dataUpdatedDate,
}: FooterProps) {
  return (
    <footer>
      {/* plugin-ui Separator：固定渲染水平 1px bg-border 线，等价原 border-t border-border；
          不传 d.ts 未声明的 orientation 属性，避免输出非标准 HTML 属性 */}
      <Separator />
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-5 text-xs text-muted-foreground">
        <span>{copyright}</span>
        {links.map((link) => (
          <a
            key={link.href + link.label}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener' : undefined}
            className={
              link.external
                ? 'inline-flex items-center gap-1 hover:text-foreground transition-colors'
                : 'hover:text-foreground transition-colors'
            }
          >
            {link.label}
          </a>
        ))}
        <span className="text-muted-foreground/60">{downloadsText}</span>
        <span className="text-muted-foreground/60">{usageText}</span>
        <span className="text-muted-foreground/60">{dataUpdatedText} {dataUpdatedDate}</span>
      </div>
    </footer>
  );
}
