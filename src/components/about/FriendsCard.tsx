// src/components/about/FriendsCard.tsx
/**
 * 关于页「友情链接」卡片。
 *
 * 与同页 AppInfoCard 保持完全一致的卡片写法（普通 div + rounded-xl border
 * border-border bg-card p-6），不引入 plugin-ui Card —— 该页其他卡片本就是这个
 * 结构，用 Card 会造成圆角/内边距差异，且需额外引入 SSR 守卫。
 *
 * 内容为纯文字列表：站名（外链）+ 一句真实描述。
 * - 不用图标/第三方图片：避免额外请求与对方图裂导致的破图。
 * - rel 只写 noopener，不写 nofollow：友链是互惠收录，nofollow 会被对方
 *   判定为无效友链（MCNav 要求提交前先挂其友链）。
 * 构建期静态渲染，零运行时 JS。
 */
export interface FriendItem {
  name: string;
  url: string;
  desc: string;
}

export interface FriendsCardProps {
  /** 区块标题：友情链接 */
  title: string;
  items: FriendItem[];
}

export default function FriendsCard({ title, items }: FriendsCardProps) {
  if (items.length === 0) return null;
  return (
    <div className="mb-4 rounded-xl border border-border bg-card p-6">
      {/* 与同页其他区块一致：标题为 h2 + text-base font-semibold */}
      <h2 className="mb-3 text-base font-semibold">{title}</h2>
      <div className="space-y-3">
        {items.map((f) => (
          <div key={f.url}>
            <a
              href={f.url}
              target="_blank"
              rel="noopener"
              className="text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              {f.name}
            </a>
            <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
