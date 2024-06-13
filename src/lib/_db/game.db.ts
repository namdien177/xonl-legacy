import type { Game } from "@/lib/types/game-state";

const GameStorage = new Map<string, Game>();

export const GameDB = {
  getGame: (gameId: string) => {
    return GameStorage.get(gameId);
  },
  setGame: (game: Game) => {
    GameStorage.set(game.id, game);
  },
  deleteGame: (gameId: string) => {
    GameStorage.delete(gameId);
  },
  queryGames: () => {
    return Array.from(GameStorage.values());
  },
};
