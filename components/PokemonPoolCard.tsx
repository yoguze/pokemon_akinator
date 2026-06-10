import Image from "next/image";
import { formatTypesJa } from "@/lib/type-labels";
import type { PokemonInfo } from "@/types/pokemon";

export function PokemonPoolCard({ pokemon }: { pokemon: PokemonInfo }) {
  return (
    <article
      className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[var(--accent)]/50"
    >
      <Image
        src={pokemon.imageUrl}
        alt={pokemon.name_ja}
        width={96}
        height={96}
        className="drop-shadow-md"
        unoptimized
      />
      <h2 className="mt-2 text-center text-base font-bold">{pokemon.name_ja}</h2>
      <p className="text-xs text-[var(--text-muted)]">{pokemon.name_en}</p>
      <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
        No.{pokemon.id}
      </p>
      <p className="mt-1 text-center text-xs">{formatTypesJa(pokemon.types)}</p>
      {(pokemon.isLegendary || pokemon.isMythical) && (
        <div className="mt-2 flex flex-wrap justify-center gap-1">
          {pokemon.isLegendary && (
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] text-amber-300">
              伝説
            </span>
          )}
          {pokemon.isMythical && (
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-300">
              幻
            </span>
          )}
        </div>
      )}
    </article>
  );
}
