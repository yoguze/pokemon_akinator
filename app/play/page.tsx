"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { SiteHeader } from "@/components/SiteHeader";
import { VictoryCard } from "@/components/VictoryCard";
import type { ChatMessage as ChatMessageType } from "@/types/pokemon";

type DisplayMessage = ChatMessageType & {
  kind: "question" | "guess";
};

type VictoryPokemon = {
  name_ja: string;
  name_en: string;
  imageUrl: string;
  types: string[];
  id: number;
};

const EXAMPLE_QUESTIONS = [
  "水タイプですか？",
  "Is it a legendary Pokémon?",
  "伝説のポケモンですか？",
];

export default function PlayPage() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [questionInput, setQuestionInput] = useState("");
  const [guessInput, setGuessInput] = useState("");
  const [questionLoading, setQuestionLoading] = useState(false);
  const [guessLoading, setGuessLoading] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [victoryPokemon, setVictoryPokemon] = useState<VictoryPokemon | null>(
    null,
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const questionInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, victoryPokemon]);

  const getQuestionHistory = (): ChatMessageType[] =>
    messages
      .filter((m) => m.kind === "question")
      .map(({ role, content }) => ({ role, content }));

  const startGame = useCallback(async () => {
    setStarting(true);
    setError(null);
    setVictoryPokemon(null);
    setMessages([]);
    setQuestionInput("");
    setGuessInput("");
    setGameId(null);

    try {
      const res = await fetch("/api/game/start", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "ゲーム開始に失敗しました");
      }

      setGameId(data.gameId);
      setMessages([
        { role: "assistant", content: data.message, kind: "question" },
      ]);
      questionInputRef.current?.focus();
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setStarting(false);
    }
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  const sendQuestion = async () => {
    const trimmed = questionInput.trim();
    if (!trimmed || !gameId || questionLoading || guessLoading || victoryPokemon) {
      return;
    }

    const userMessage: DisplayMessage = {
      role: "user",
      content: trimmed,
      kind: "question",
    };
    const historyBefore = getQuestionHistory();
    setMessages((prev) => [...prev, userMessage]);
    setQuestionInput("");
    setQuestionLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId,
          message: trimmed,
          history: historyBefore,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "送信に失敗しました");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, kind: "question" },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setQuestionLoading(false);
      questionInputRef.current?.focus();
    }
  };

  const submitGuess = async () => {
    const trimmed = guessInput.trim();
    if (!trimmed || !gameId || questionLoading || guessLoading || victoryPokemon) {
      return;
    }

    const userMessage: DisplayMessage = {
      role: "user",
      content: `答え: ${trimmed}`,
      kind: "guess",
    };
    setMessages((prev) => [...prev, userMessage]);
    setGuessInput("");
    setGuessLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameId, guess: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "判定に失敗しました");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message, kind: "guess" },
      ]);

      if (data.isGameOver && data.isCorrect && data.pokemon) {
        setVictoryPokemon(data.pokemon);
        setGameId(null);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setGuessLoading(false);
    }
  };

  const handleQuestionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      sendQuestion();
    }
  };

  const handleGuessKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submitGuess();
    }
  };

  const isLoading = questionLoading || guessLoading;

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader
        subtitle="質問で絞り込んで、名前を当てよう"
        actions={
          <button
            type="button"
            onClick={startGame}
            disabled={starting}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 text-sm transition hover:border-[var(--accent)] disabled:opacity-50"
          >
            {starting ? "準備中…" : "新しいゲーム"}
          </button>
        }
      />

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-4">
        {error && (
          <div className="mb-3 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-[var(--ai-bubble)] px-4 py-3 text-sm text-[var(--text-muted)]">
                {guessLoading ? "判定中…" : "考え中…"}
              </div>
            </div>
          )}

          {victoryPokemon && (
            <div className="pt-4">
              <VictoryCard
                nameJa={victoryPokemon.name_ja}
                nameEn={victoryPokemon.name_en}
                imageUrl={victoryPokemon.imageUrl}
                types={victoryPokemon.types}
                id={victoryPokemon.id}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {!victoryPokemon && gameId && (
          <div className="space-y-4 border-t border-[var(--border)] pt-3">
            <section>
              <p className="mb-2 text-xs font-semibold text-[var(--text-muted)]">
                質問する（Yes / No で答えます）
              </p>
              <p className="mb-2 text-xs text-[var(--text-muted)]">
                例: {EXAMPLE_QUESTIONS.join(" · ")}
              </p>
              <div className="flex gap-2">
                <input
                  ref={questionInputRef}
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyDown={handleQuestionKeyDown}
                  placeholder="質問を入力…（例: 水タイプですか？）"
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={sendQuestion}
                  disabled={isLoading || !questionInput.trim()}
                  className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-bold text-[#1a1a2e] transition hover:brightness-110 disabled:opacity-50"
                >
                  質問
                </button>
              </div>
            </section>

            <section>
              <p className="mb-2 text-xs font-semibold text-[var(--text-muted)]">
                答えを宣言する（AIを使わず判定・トークン消費なし）
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  onKeyDown={handleGuessKeyDown}
                  placeholder="ポケモンの名前…（例: ピカチュウ）"
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none transition focus:border-[var(--success)] disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={submitGuess}
                  disabled={isLoading || !guessInput.trim()}
                  className="rounded-xl bg-[var(--accent-dark)] px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
                >
                  回答
                </button>
              </div>
            </section>
          </div>
        )}

        {victoryPokemon && (
          <div className="border-t border-[var(--border)] pt-4 text-center">
            <button
              type="button"
              onClick={startGame}
              disabled={starting}
              className="rounded-xl bg-[var(--accent-dark)] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              もう一度プレイ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
