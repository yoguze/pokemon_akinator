import { fetchPokemonInfo } from "@/lib/pokeapi";
import { fetchPokemonListWithMeta } from "@/lib/microcms";
import type { PokemonInfo, PokemonListSource } from "@/types/pokemon";

export type FullPokemonList = {
  source: PokemonListSource;
  pokemons: PokemonInfo[];
  failedCount: number;
};

export async function fetchFullPokemonList(): Promise<FullPokemonList> {
  const { source, entries } = await fetchPokemonListWithMeta();

  const results = await Promise.allSettled(
    entries.map((entry) => fetchPokemonInfo(entry)),
  );

  const pokemons = results
    .filter((r): r is PromiseFulfilledResult<PokemonInfo> => r.status === "fulfilled")
    .map((r) => r.value)
    .sort((a, b) => a.id - b.id);

  const failedCount = results.filter((r) => r.status === "rejected").length;

  return { source, pokemons, failedCount };
}
