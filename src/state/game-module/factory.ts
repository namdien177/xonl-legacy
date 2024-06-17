import type { Game, GamePlayer } from "@/lib/types/game-state";

export const createGamePlaceholder = (): Game => {
  const users: [GamePlayer, GamePlayer] = [
    { id: "red", name: "Red Player" },
    { id: "blue", name: "Blue Player" },
  ];

  const randomIds = Math.floor(Math.random() * 2);

  return {
    id: `game-${randomIds}`,
    name: "new game!",
    colMode: 3,
    moves: [],
    logs: [],
    winMode: "until-win",
    status: "waiting",
    players: users,
    boardState: [],
  };
};
