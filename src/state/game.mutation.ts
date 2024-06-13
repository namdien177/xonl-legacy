import type {
  Game,
  GameMove,
  WinningCombination,
} from "@/lib/types/game-state";
import Vue from "vue";

const create = "createGame";
const startPlaying = "setPlaying";
const setMove = "setMove";
const end = "endGame";
const updateBoard = "updateBoard";

export type MakeWinnerProps = {
  winner_id: string;
  winCombination: WinningCombination;
};

export const GAME_MUTATIONS = {
  create,
  startPlaying,
  setMove,
  updateBoard,
  end,
} as const;

export const updateMove = (move: GameMove, state: Game) => {
  if (state.status !== "playing") {
    return null;
  }

  const moveStrategy = state.winMode;
  if (moveStrategy === "until-win") {
    return updateMoveUntilWin(move, state);
  }

  return updateMoveNormal(move, state);
};

const updateMoveUntilWin = (
  move: GameMove,
  state: Game
): null | Partial<Game> => {
  const board = state.boardState;
  const [row, col] = move.coordinate;
  const user = state.players.find((player) => player.id === move.owner_id);

  if (!user) {
    return null;
  }

  const isCellEmpty = !board[row]?.[col];
  if (!isCellEmpty) {
    return null;
  }

  const maxMovesLength = state.colMode * state.colMode;
  const currentMovesLength = state.moves.length;
  const isNormalMove = currentMovesLength < maxMovesLength - 1;
  const currentTurn = state.players.find(
    (player) => player.id !== move.owner_id
  );

  if (isNormalMove) {
    // update the game board
    if (!board[row]) {
      Vue.set(board, row, []);
    }
    Vue.set(board[row], col, user);
    state.moves.push(move);
    state.logs.push(move);

    return {
      boardState: board,
      moves: state.moves,
      logs: state.logs,
      currentTurn,
    };
  }

  // get the first move in the list
  const firstMove = state.moves.shift();
  if (!firstMove) {
    return null;
  }
  state.moves.push(move);
  // update board with new move
  Vue.set(board[row], col, user);
  // remove the first move from board
  const [firstRow, firstCol] = firstMove.coordinate;
  Vue.set(board[firstRow], firstCol, null);
  // push the new move to the logs
  state.logs.push(move);
  return {
    boardState: board,
    moves: state.moves,
    logs: state.logs,
    currentTurn,
  };
};

const updateMoveNormal = (
  move: GameMove,
  state: Game
): null | Partial<Game> => {
  const board = state.boardState;
  const [row, col] = move.coordinate;
  const user = state.players.find((player) => player.id === move.owner_id);

  if (!user) {
    return null;
  }

  const isCellEmpty = !board[row]?.[col];
  if (!isCellEmpty) {
    return null;
  }

  const maxMovesLength = state.colMode * state.colMode;
  const currentMovesLength = state.moves.length;
  const isMaxedMoves = currentMovesLength < maxMovesLength;

  if (isMaxedMoves) {
    return null;
  }

  const currentTurn = state.players.find(
    (player) => player.id !== move.owner_id
  );

  // update the game board
  if (!board[row]) {
    Vue.set(board, row, []);
  }
  Vue.set(board[row], col, user);
  state.moves.push(move);
  state.logs.push(move);
  return {
    boardState: board,
    moves: state.moves,
    logs: state.logs,
    currentTurn,
  };
};
