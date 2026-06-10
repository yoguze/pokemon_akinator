import OpenAI from "openai";
import type { ChatMessage } from "@/types/pokemon";
import { buildSystemPrompt } from "@/lib/system-prompt";
import type { PokemonInfo } from "@/types/pokemon";
import { mockAIRespond } from "@/lib/mock-ai";

export function isOpenAIConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export async function respondWithAI(
  pokemon: PokemonInfo,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  if (!isOpenAIConfigured()) {
    return mockAIRespond(userMessage, pokemon);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt(pokemon) },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: userMessage },
  ];

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages,
    temperature: 0.2,
    max_tokens: 50,
  });

  return completion.choices[0]?.message?.content?.trim() ?? "いいえ";
}
