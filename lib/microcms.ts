import { FALLBACK_POKEMON_LIST } from "@/lib/fallback-pokemon";
import type { PokemonEntry, PokemonListSource } from "@/types/pokemon";

type MicroCMSListResponse = {
  contents: PokemonEntry[];
  totalCount: number;
};

export function isMicroCMSConfigured(): boolean {
  return Boolean(
    process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY,
  );
}

export type PokemonListMeta = {
  source: PokemonListSource;
  entries: PokemonEntry[];
};

export async function fetchPokemonListWithMeta(): Promise<PokemonListMeta> {
  if (!isMicroCMSConfigured()) {
    return { source: "fallback", entries: FALLBACK_POKEMON_LIST };
  }

  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN!;
  const apiKey = process.env.MICROCMS_API_KEY!;
  const url = `https://${serviceDomain}.microcms.io/api/v1/pokemons?limit=100`;

  const response = await fetch(url, {
    headers: { "X-MICROCMS-API-KEY": apiKey },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    console.error("microCMS fetch failed:", response.status, response.statusText);
    return { source: "fallback", entries: FALLBACK_POKEMON_LIST };
  }

  const data = (await response.json()) as MicroCMSListResponse;
  if (!data.contents?.length) {
    return { source: "fallback", entries: FALLBACK_POKEMON_LIST };
  }

  return { source: "microcms", entries: data.contents };
}

export async function fetchPokemonList(): Promise<PokemonEntry[]> {
  const { entries } = await fetchPokemonListWithMeta();
  return entries;
}

export function pickRandomPokemon(list: PokemonEntry[]): PokemonEntry {
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}
