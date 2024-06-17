const fetchGame = "fetchGame";
const create = "createGame";
const invitePlayer = "invitePlayer";
const joinGame = "joinGame";
const startPlaying = "setPlaying";

const firstPlayerMove = "firstPlayerMove";
const secondPlayerMove = "secondPlayerMove";

const gameIsDecided = "gameIsDecided";
const restartGame = "restartGame";

export const GameActions = {
  fetchGame,
  create,
  invitePlayer,
  joinGame,
  startPlaying,
  firstPlayerMove,
  secondPlayerMove,
  gameIsDecided,
  restartGame,
} as const;
