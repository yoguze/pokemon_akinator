import { NextRequest, NextResponse } from "next/server";
import { checkGuess } from "@/lib/check-guess";
import { deleteGameSession, getGameSession } from "@/lib/game-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const gameId = body.gameId as string | undefined;
    const guess = (body.guess as string | undefined)?.trim();

    if (!gameId) {
      return NextResponse.json({ error: "gameId が必要です。" }, { status: 400 });
    }
    if (!guess) {
      return NextResponse.json({ error: "答えを入力してください。" }, { status: 400 });
    }

    const session = getGameSession(gameId);
    if (!session) {
      return NextResponse.json(
        { error: "ゲームが見つかりません。新しいゲームを始めてください。" },
        { status: 404 },
      );
    }

    const isCorrect = checkGuess(guess, session.pokemon);

    if (isCorrect) {
      const pokemon = session.pokemon;
      deleteGameSession(gameId);

      return NextResponse.json({
        message: "正解です！",
        isCorrect: true,
        isGameOver: true,
        pokemon: {
          name_ja: pokemon.name_ja,
          name_en: pokemon.name_en,
          imageUrl: pokemon.imageUrl,
          types: pokemon.types,
          id: pokemon.id,
        },
      });
    }

    return NextResponse.json({
      message: "違います。",
      isCorrect: false,
      isGameOver: false,
    });
  } catch (error) {
    console.error("Guess error:", error);
    return NextResponse.json(
      { error: "判定に失敗しました。" },
      { status: 500 },
    );
  }
}
