export type PokemonEntry = {
  name_ja: string;
  name_en: string;
};

export type PokemonListSource = "microcms" | "fallback";

export type PokemonInfo = {
  name_ja: string;
  name_en: string;
  id: number;
  types: string[];
  imageUrl: string;
  isLegendary: boolean;
  isMythical: boolean;
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type GameStartResponse = {
  gameId: string;
  message: string;
};

export type ChatResponse = {
  message: string;
  isCorrect: boolean;
  isGameOver: boolean;
  pokemon?: {
    name_ja: string;
    name_en: string;
    imageUrl: string;
    types: string[];
    id: number;
  };
};
