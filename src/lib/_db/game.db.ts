import type { Game } from "@/lib/types/game-state";

const GameStorage = new Map<string, Game>();

export const GameDB = {
  getGame: (gameId: string) => {
    return new Promise<{
      data: Game | null;
    }>((resolve) => {
      setTimeout(
        () => {
          const game = GameStorage.get(gameId);
          resolve({
            data: game ?? null,
          });
        },
        // random from 100-500ms
        Math.floor(Math.random() * 400) + 100
      );
    });
  },
  setGame: async (game: Game) => {
    GameStorage.set(game.id, game);
  },
  deleteGame: (gameId: string) => {
    GameStorage.delete(gameId);
  },
  queryGames: () => {
    return Array.from(GameStorage.values());
  },
};
