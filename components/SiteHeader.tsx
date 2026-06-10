import Link from "next/link";

type Props = {
  subtitle?: string;
  actions?: React.ReactNode;
};

const navItems = [
  { href: "/", label: "ホーム" },
  { href: "/play", label: "プレイ" },
  { href: "/pokemons", label: "出題一覧" },
];

export function SiteHeader({ subtitle, actions }: Props) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur">
      <div className="mx-auto max-w-4xl px-4 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <Link href="/" className="block">
              <h1 className="text-xl font-bold tracking-tight text-[var(--text)]">
                ポケモンアキネーター
              </h1>
            </Link>
            <p className="text-xs text-[var(--text-muted)]">
              {subtitle ?? "AIが思い浮かべたポケモンを質問で当てよう"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <nav className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 text-sm transition hover:border-[var(--accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {actions}
          </div>
        </div>
      </div>
    </header>
  );
}
