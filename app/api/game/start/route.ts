import { NextResponse } from "next/server";
import { createGameSession } from "@/lib/game-store";
import { fetchPokemonInfo } from "@/lib/pokeapi";
import { fetchPokemonList, pickRandomPokemon } from "@/lib/microcms";
import { isMicroCMSConfigured } from "@/lib/microcms";
import { isOpenAIConfigured } from "@/lib/openai";

export async function POST() {
  try {
    const list = await fetchPokemonList();
    const entry = pickRandomPokemon(list);
    const pokemon = await fetchPokemonInfo(entry);
    const gameId = createGameSession(pokemon);

    const modeNotes: string[] = [];
    if (!isMicroCMSConfigured()) {
      modeNotes.push("サンプルリスト");
    }
    if (!isOpenAIConfigured()) {
      modeNotes.push("モックAI");
    }

    const modeHint =
      modeNotes.length > 0 ? `（${modeNotes.join("・")}モード）` : "";

    return NextResponse.json({
      gameId,
      message: `ポケモンを1体思い浮かべました！質問をどうぞ。${modeHint}`,
    });
  } catch (error) {
    console.error("Game start error:", error);
    return NextResponse.json(
      { error: "ゲームの開始に失敗しました。しばらくしてから再度お試しください。" },
      { status: 500 },
    );
  }
}
