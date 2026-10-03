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
  switchHref: string;
  switchLabel: string;
}

/**
 * 官网顶栏 — plugin-ui Button 原语重构（ghost 导航项 / outline 语言切换）。
 * 移动端开合仍由壳层 .astro 里的 vanilla 脚本驱动（#menu-btn / #nav-menu id 不变）。
 * 构建期静态渲染，无 hydration。
 */
export default function Header({ homeHref, brand, links, switchHref, switchLabel }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <a href={homeHref} className="flex items-center gap-2 text-lg font-bold">
          <img src="/logo.svg" alt="QML" className="h-7 w-auto" />
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
          <ul className="flex items-center gap-1 max-md:flex-col max-md:gap-0 max-md:pt-2">
            {links.map((link) => (
              <li key={link.href + link.label} className="max-md:w-full">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-auto px-3 py-1.5 font-normal text-muted-foreground hover:text-foreground max-md:block max-md:w-full max-md:rounded-lg max-md:py-2.5"
                >
                  <a href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noopener' : undefined}>
                    {link.label}
                  </a>
                </Button>
              </li>
            ))}
            <li className="max-md:mt-2 max-md:w-full max-md:border-t max-md:border-border max-md:pt-2">
              <Button asChild variant="outline" size="sm" className="ml-1 text-xs text-muted-foreground hover:text-accent-foreground max-md:ml-0 max-md:block max-md:w-full max-md:text-center max-md:py-2">
                <a href={switchHref}>{switchLabel}</a>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
