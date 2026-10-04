import { Button } from '@qomicex/plugin-ui';

export interface NavLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface HeaderProps {
  homeHref: string;
  brand: string;
  links: NavLink[];
  /** 当前页路径（已归一化，如 /download/），用于高亮当前导航项 */
  currentPath?: string;
  switchHref: string;
  switchLabel: string;
}

/**
 * 官网顶栏 — plugin-ui Button 原语 + Tabs 视觉语言导航。
 * 移动端开合仍由壳层 .astro 里的 vanilla 脚本驱动（#menu-btn / #nav-menu id 不变）。
 * 构建期静态渲染，无 hydration、零运行时 JS。
 *
 * 关于「导航为何不用 plugin-ui 的 Tabs 组件」（重要，勿回退）：
 * 读 node_modules/@qomicex/plugin-ui/dist/components/Tabs.js 可知它是受控组件——
 *   onClick 仅回调 onChange，指示器尺寸靠 useEffect 读取 offsetWidth 后写入，
 *   且 indicator 初始 style 为 width:0/height:0。
 * 本站全站零 client:* 指令（构建期 renderToString），无水合则：
 *   ① 点击不触发任何跳转（导航失效）；② 指示器永远 0×0（不可见）。
 * 且导航本质是跨页跳转而非同页切换内容，语义上应为 <a>。
 * 故此处以「Tabs 视觉语言」实现：横排等高铁底边框，
 * 当前项用 border-primary 指示条 + text-foreground + aria-current="page" 表达选中。
 */
export default function Header({ homeHref, brand, links, currentPath, switchHref, switchLabel }: HeaderProps) {
  const norm = (p: string) => (p.endsWith('/') ? p : p + '/');
  const current = currentPath ? norm(currentPath) : '';
  const isActive = (href: string) => {
    if (!current || href.startsWith('http')) return false;
    return norm(href) === current;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <a href={homeHref} className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <img src="/logo.svg" alt="" className="h-6 w-auto" />
          {brand}
        </a>
        <Button
          id="menu-btn"
          variant="ghost"
          size="icon"
          className="cursor-pointer text-muted-foreground hover:text-foreground md:hidden"
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </Button>
        <nav
          id="nav-menu"
          className="hidden max-md:fixed max-md:inset-x-0 max-md:top-14 max-md:border-b max-md:border-border max-md:bg-background/95 max-md:backdrop-blur-sm max-md:px-4 max-md:pb-4 md:block"
        >
          {/* 桌面端：Tabs 视觉语言 —— 横排、等高、底部指示条；移动端：纵向列表 */}
          <ul className="flex items-center gap-0.5 max-md:flex-col max-md:items-stretch max-md:gap-0 max-md:pt-2">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href + link.label} className="max-md:w-full">
                  <a
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener' : undefined}
                    aria-current={active ? 'page' : undefined}
                    className={
                      'relative inline-flex h-14 items-center px-3 text-sm transition-colors ' +
                      'max-md:h-auto max-md:w-full max-md:rounded-lg max-md:px-3 max-md:py-2.5 ' +
                      (active
                        ? 'text-foreground after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary max-md:after:hidden max-md:bg-accent'
                        : 'text-muted-foreground hover:text-foreground max-md:hover:bg-accent')
                    }
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
            <li className="max-md:mt-2 max-md:w-full max-md:border-t max-md:border-border max-md:pt-2">
              <a
                href={switchHref}
                className="inline-flex h-14 items-center px-3 text-sm text-muted-foreground transition-colors hover:text-foreground max-md:h-auto max-md:w-full max-md:rounded-lg max-md:px-3 max-md:py-2.5 max-md:hover:bg-accent"
              >
                {switchLabel}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
