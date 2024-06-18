import type { Game, GameCreatePayload } from "@/lib/types/game-state";
import { createGamePlaceholder } from "@/state/game-module/factory";

const GameStorage = new Map<string, Game>();
// @ts-ignore
window.GameStorage = GameStorage;

export const GameDB = {
  getGame: (gameId: string) => {
    return new Promise<{
      data: Game | null;
    }>((resolve) => {
      setTimeout(
        () => {
          const game = GameStorage.get(gameId);
          resolve({
            data: game ? structuredClone(game) : null,
          });
        },
        // random from 100-500ms
        Math.floor(Math.random() * 400) + 100
      );
    });
  },
  setGame: async (game: GameCreatePayload) => {
    const inserted: Game = {
      ...createGamePlaceholder(),
      ...game,
    };
    GameStorage.set(inserted.id, inserted);
    return inserted;
  },
  deleteGame: (gameId: string) => {
    GameStorage.delete(gameId);
  },
  queryGames: () => {
    return Array.from(GameStorage.values());
  },
};
