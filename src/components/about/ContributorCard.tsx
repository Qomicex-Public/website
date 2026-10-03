// SSR 中心守卫
import '../../lib/ssr-dom-shim';

export interface ContributorCardProps {
  avatarUrl: string;
  login: string;
  contributions: number;
  htmlUrl: string;
}

/**
 * 关于页 — 贡献者卡片。
 * 保留原样交互：GitHub 链接、hover 效果均通过 className 透传实现，零 JS。
 * 构建期静态渲染，零运行时 JS。
 */
export default function ContributorCard({
  avatarUrl, login, contributions, htmlUrl,
}: ContributorCardProps) {
  return (
    <div className="flex items-center gap-3">
      <img src={avatarUrl} alt={login} className="size-10 rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{login}</div>
        <div className="text-xs text-muted-foreground">{contributions} 次提交</div>
      </div>
      <a
        href={htmlUrl}
        target="_blank"
        rel="noopener"
        className="inline-flex h-7 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
      >
        {/* Inline GitHub SVG */}
        <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.38.6.11.82-.26.82-.58v-1.93c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.3.02 2.61.14 3.3.4 2.29-1.55 3.3-1.23 3.3-1.23.65 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.63-5.47 5.93.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.57C20.56 21.8 24 17.31 24 12 24 5.37 18.63 0 12 0z"/>
        </svg>
        GitHub
      </a>
    </div>
  );
}
