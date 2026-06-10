import { NextRequest, NextResponse } from "next/server";
import { getGameSession } from "@/lib/game-store";
import { respondWithAI } from "@/lib/openai";
import type { ChatMessage } from "@/types/pokemon";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const gameId = body.gameId as string | undefined;
    const message = (body.message as string | undefined)?.trim();
    const history = (body.history as ChatMessage[] | undefined) ?? [];

    if (!gameId) {
      return NextResponse.json({ error: "gameId が必要です。" }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "メッセージを入力してください。" }, { status: 400 });
    }

    const session = getGameSession(gameId);
    if (!session) {
      return NextResponse.json(
        { error: "ゲームが見つかりません。新しいゲームを始めてください。" },
        { status: 404 },
      );
    }

    const reply = await respondWithAI(session.pokemon, history, message);

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "応答の取得に失敗しました。" },
      { status: 500 },
    );
  }
}
