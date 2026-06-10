import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ポケモンアキネーター",
  description: "AIが思い浮かべたポケモンを質問で当てるゲーム",
};

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <p className="mb-2 text-sm font-medium tracking-widest text-[var(--accent)]">
          POKÉMON
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          ポケモン
          <br />
          アキネーター
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
          AIがポケモンを1体思い浮かべています。
          <br />
          質問して絞り込み、名前を当ててください。
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <Link
            href="/play"
            className="rounded-xl bg-[var(--accent)] px-6 py-4 text-lg font-bold text-[#1a1a2e] transition hover:brightness-110"
          >
            プレイ
          </Link>
          <Link
            href="/pokemons"
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-6 py-4 text-lg font-bold transition hover:border-[var(--accent)]"
          >
            出題一覧
          </Link>
        </div>

        <p className="mt-8 text-xs text-[var(--text-muted)]">
          出題一覧に載っているポケモンだけが出題されます
        </p>
      </div>
    </main>
  );
}
