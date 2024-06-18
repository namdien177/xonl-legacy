const setIsFetchingGame = "setIsFetchingGame";
const setFetchingSuccess = "setFetchingSuccess";
const setFetchingError = "setFetchingError";

const setGame = "setGame";
const addSecondPlayer = "addSecondPlayer";
const setPlaying = "setPlaying";
const doMove = "doMove";
const setGameWinner = "setGameWinner";

const createGameLoading = "createGameLoading";
const createGameSuccess = "createGameSuccess";
const createGameError = "createGameError";
const resetCreateState = "resetCreateState";

export const GameMutations = {
  setIsFetchingGame,
  setFetchingSuccess,
  setFetchingError,
  setGame,
  addSecondPlayer,
  setPlaying,
  doMove,
  setGameWinner,
  // create action
  createGameLoading,
  createGameSuccess,
  createGameError,
  resetCreateState,
} as const;
