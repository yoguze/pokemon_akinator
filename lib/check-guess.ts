import type { PokemonInfo } from "@/types/pokemon";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "")
    .replace(/[！!。、,．.]/g, "")
    .replace(/(です|だ|じゃない|ではない|だと思う|だと思います)$/u, "");
}

export function checkGuess(guess: string, pokemon: PokemonInfo): boolean {
  const normalized = normalize(guess);
  if (!normalized) return false;

  return (
    normalized === normalize(pokemon.name_ja) ||
    normalized === normalize(pokemon.name_en)
  );
}
