import '../../lib/ssr-dom-shim';

export interface AppInfoCardProps {
  logoSrc: string;
  logoAlt: string;
  name: string;
  versionLabel: string;
  version: string;
  description: string;
  repoUrl: string;
  repoLabel: string;
}

/**
 * 关于页 — 应用信息卡片（Logo / 名称版本 / 描述 / 仓库链接）。
 * Button(asChild) 用于「查看仓库」按钮；其余内容原样保留。
 * 构建期静态渲染，零运行时 JS。
 */
export default function AppInfoCard({
  logoSrc, logoAlt, name, versionLabel, version, description, repoUrl, repoLabel,
}: AppInfoCardProps) {
  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-6">
      <div className="flex items-center gap-4">
        <img src={logoSrc} alt={logoAlt} className="h-14 w-14 rounded-2xl" />
        <div className="min-w-0 flex-1">
          {/* 应用名承载本页 h1 语义；Tailwind preflight 下与原先的 div 渲染一致，视觉零变化 */}
          <h1 className="text-lg font-semibold">{name}</h1>
          <div className="text-sm text-muted-foreground">{versionLabel} {version}</div>
        </div>
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener"
          className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {/* Inline GitHub SVG matching fa6-brands:github */}
          <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.38.6.11.82-.26.82-.58v-1.93c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.3.02 2.61.14 3.3.4 2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.63-5.47 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.57C20.56 21.8 24 17.31 24 12 24 5.37 18.63 0 12 0z"/>
          </svg>
          {repoLabel}
        </a>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
