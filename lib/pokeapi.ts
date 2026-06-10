import type { PokemonEntry, PokemonInfo } from "@/types/pokemon";

type PokeAPIPokemon = {
  id: number;
  types: Array<{ type: { name: string } }>;
  sprites: { front_default: string | null };
};

type PokeAPISpecies = {
  is_legendary: boolean;
  is_mythical: boolean;
};

export async function fetchPokemonInfo(entry: PokemonEntry): Promise<PokemonInfo> {
  const nameEn = entry.name_en.toLowerCase().trim();
  const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${nameEn}`;
  const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${nameEn}`;

  const [pokemonRes, speciesRes] = await Promise.all([
    fetch(pokemonUrl),
    fetch(speciesUrl),
  ]);

  if (!pokemonRes.ok) {
    throw new Error(`PokeAPI pokemon fetch failed: ${pokemonRes.status}`);
  }
  if (!speciesRes.ok) {
    throw new Error(`PokeAPI species fetch failed: ${speciesRes.status}`);
  }

  const pokemon = (await pokemonRes.json()) as PokeAPIPokemon;
  const species = (await speciesRes.json()) as PokeAPISpecies;

  const types = pokemon.types.map((t) => t.type.name);
  const imageUrl =
    pokemon.sprites.front_default ??
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

  return {
    name_ja: entry.name_ja,
    name_en: nameEn,
    id: pokemon.id,
    types,
    imageUrl,
    isLegendary: species.is_legendary,
    isMythical: species.is_mythical,
  };
}
