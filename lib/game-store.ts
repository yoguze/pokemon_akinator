import type { PokemonInfo } from "@/types/pokemon";

type GameSession = {
  pokemon: PokemonInfo;
  createdAt: number;
};

const SESSION_TTL_MS = 60 * 60 * 1000; // 1 hour
const sessions = new Map<string, GameSession>();

function cleanupExpiredSessions() {
  const now = Date.now();
  for (const [id, session] of sessions) {
    if (now - session.createdAt > SESSION_TTL_MS) {
      sessions.delete(id);
    }
  }
}

export function createGameSession(pokemon: PokemonInfo): string {
  cleanupExpiredSessions();
  const gameId = crypto.randomUUID();
  sessions.set(gameId, { pokemon, createdAt: Date.now() });
  return gameId;
}

export function getGameSession(gameId: string): GameSession | undefined {
  cleanupExpiredSessions();
  const session = sessions.get(gameId);
  if (!session) return undefined;
  if (Date.now() - session.createdAt > SESSION_TTL_MS) {
    sessions.delete(gameId);
    return undefined;
  }
  return session;
}

export function deleteGameSession(gameId: string): void {
  sessions.delete(gameId);
}
