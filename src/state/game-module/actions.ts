const createGame = "createGame";
const fetchGame = "fetchGame";
const invitePlayer = "invitePlayer";
const joinGame = "joinGame";
const startPlaying = "setPlaying";

const playerMove = "playerMove";

const gameIsDecided = "gameIsDecided";
const restartGame = "restartGame";

export const GameActions = {
  createGame,
  fetchGame,
  invitePlayer,
  joinGame,
  startPlaying,
  playerMove,
  gameIsDecided,
  restartGame,
} as const;
