import type { PokemonInfo } from "@/types/pokemon";

const TYPE_ALIASES: Record<string, string[]> = {
  normal: ["ノーマル", "normal"],
  fire: ["ほのお", "火", "fire"],
  water: ["みず", "水", "water"],
  electric: ["でんき", "電気", "electric"],
  grass: ["くさ", "草", "grass"],
  ice: ["こおり", "氷", "ice"],
  fighting: ["かくとう", "格闘", "fighting"],
  poison: ["どく", "毒", "poison"],
  ground: ["じめん", "地面", "ground"],
  flying: ["ひこう", "飛行", "flying"],
  psychic: ["エスパー", "超", "psychic"],
  bug: ["むし", "虫", "bug"],
  rock: ["いわ", "岩", "rock"],
  ghost: ["ゴースト", "ghost", "幽霊"],
  dragon: ["ドラゴン", "dragon"],
  dark: ["あく", "悪", "dark"],
  steel: ["はがね", "鋼", "steel"],
  fairy: ["フェアリー", "fairy"],
};

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "");
}

function containsAny(text: string, keywords: string[]): boolean {
  const normalized = normalize(text);
  return keywords.some((k) => normalized.includes(normalize(k)));
}

function answerTypeQuestion(text: string, pokemon: PokemonInfo): boolean | null {
  if (!containsAny(text, ["タイプ", "type", "属性"])) {
    return null;
  }

  for (const [typeName, aliases] of Object.entries(TYPE_ALIASES)) {
    if (containsAny(text, aliases)) {
      return pokemon.types.includes(typeName);
    }
  }
  return null;
}

function answerLegendaryQuestion(text: string, pokemon: PokemonInfo): boolean | null {
  if (
    containsAny(text, ["伝説", "legendary", "レジェンド"]) &&
    !containsAny(text, ["幻", "mythical", "ミュージカル"])
  ) {
    return pokemon.isLegendary;
  }
  return null;
}

function answerMythicalQuestion(text: string, pokemon: PokemonInfo): boolean | null {
  if (containsAny(text, ["幻", "mythical", "ミュージカル"])) {
    return pokemon.isMythical;
  }
  return null;
}

function answerIdQuestion(text: string, pokemon: PokemonInfo): boolean | null {
  const numberMatch = text.match(/(\d{1,4})/);
  if (
    numberMatch &&
    containsAny(text, ["番", "図鑑", "id", "number", "no"])
  ) {
    return pokemon.id === Number(numberMatch[1]);
  }
  return null;
}

export function mockAIRespond(userMessage: string, pokemon: PokemonInfo): string {
  const text = userMessage.trim();
  if (!text) {
    return "いいえ";
  }

  const checks = [
    answerTypeQuestion(text, pokemon),
    answerLegendaryQuestion(text, pokemon),
    answerMythicalQuestion(text, pokemon),
    answerIdQuestion(text, pokemon),
  ];

  for (const result of checks) {
    if (result !== null) {
      return result ? "はい" : "いいえ";
    }
  }

  return "いいえ";
}
