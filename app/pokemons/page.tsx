import { SiteHeader } from "@/components/SiteHeader";
import { PokemonPoolCard } from "@/components/PokemonPoolCard";
import { fetchFullPokemonList } from "@/lib/pokemon-list";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "出題ポケモン一覧 | ポケモンアキネーター",
  description: "このゲームで出題されるポケモンの一覧",
};

export const revalidate = 3600;

export default async function PokemonsPage() {
  const { source, pokemons, failedCount } = await fetchFullPokemonList();

  const sourceLabel =
    source === "microcms"
      ? "microCMS に登録されたリスト"
      : "内蔵サンプルリスト（microCMS 未設定）";

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader subtitle="出題されるポケモンだけを当てよう" />

      <div className="mx-auto w-full max-w-4xl px-4 py-6">
        <section className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h2 className="text-lg font-bold">出題ポケモン一覧</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">
            このページに載っているポケモンだけが出題されます。
            載っていないポケモンは出題されないので、答えの候補はこの一覧の中に絞って考えてください。
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-lg bg-[var(--surface-hover)] px-3 py-1">
              出題数: <strong className="text-[var(--accent)]">{pokemons.length}</strong> 体
            </span>
            <span className="rounded-lg bg-[var(--surface-hover)] px-3 py-1 text-[var(--text-muted)]">
              データ元: {sourceLabel}
            </span>
          </div>
          {failedCount > 0 && (
            <p className="mt-3 text-sm text-amber-300">
              {failedCount} 件のポケモン情報を取得できませんでした（名前の表記を確認してください）。
            </p>
          )}
        </section>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {pokemons.map((pokemon) => (
            <PokemonPoolCard key={pokemon.name_en} pokemon={pokemon} />
          ))}
        </div>

        {pokemons.length === 0 && (
          <p className="text-center text-sm text-[var(--text-muted)]">
            出題ポケモンが登録されていません。
          </p>
        )}
      </div>
    </main>
  );
}
