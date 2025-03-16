import { useState, useEffect } from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import GameOver from "./components/GameOver";
import { WINNING_COMBINATIONS } from "./WinningCombinations";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function derivedActivePlayers(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function App() {
  const [players, setPlayers] = useState({ X: "Player 1", O: "Player 2" });
  const [playerSymbol, setPlayerSymbol] = useState(null); // 'X' or 'O'
  const [joined, setJoined] = useState(false);
  const [gameTurns, setGameTurns] = useState([]);
  const [roomId] = useState("room1");
  const [connectionStatus, setConnectionStatus] = useState("🔌 Connecting...");

  const activePlayer = derivedActivePlayers(gameTurns);

  const gameBoard = initialGameBoard.map((row) => [...row]);
  for (const turn of gameTurns) {
    const { square, player } = turn;
    if (square && typeof square.row === "number" && typeof square.col === "number") {
      const { row, col } = square;
      gameBoard[row][col] = player;
    }
  }

  let winner;
  for (const combination of WINNING_COMBINATIONS) {
    const [a, b, c] = combination;
    const symbolA = gameBoard[a.row][a.column];
    const symbolB = gameBoard[b.row][b.column];
    const symbolC = gameBoard[c.row][c.column];

    if (symbolA && symbolA === symbolB && symbolB === symbolC) {
      winner = players[symbolA];
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  useEffect(() => {
    socket.on("connect", () => setConnectionStatus("🟢 Connected"));
    socket.on("disconnect", () => setConnectionStatus("🔴 Disconnected"));

    socket.on("update-board", (updatedTurns) => {
      setGameTurns(updatedTurns);
    });

    socket.on("reset-board", () => {
      setGameTurns([]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("update-board");
      socket.off("reset-board");
    };
  }, []);

  useEffect(() => {
    if (!playerSymbol || !joined) return;
    socket.emit("join-room", { roomId, player: playerSymbol });
  }, [joined, playerSymbol, roomId]);

  const handleJoin = (symbol) => {
    setPlayerSymbol(symbol);
    setJoined(true);
  };

  function handleSelectSquare(rowIndex, colIndex) {
    if (
      gameBoard[rowIndex][colIndex] ||
      activePlayer !== playerSymbol ||
      winner ||
      hasDraw
    ) {
      return;
    }

    const newTurn = {
      square: { row: rowIndex, col: colIndex },
      player: playerSymbol,
    };

    const updatedTurns = [newTurn, ...gameTurns];
    setGameTurns(updatedTurns);
    socket.emit("move", { roomId, turns: updatedTurns });
  }

  function handlePlayerChange(symbol, newName) {
    setPlayers((prev) => ({ ...prev, [symbol]: newName }));
  }

  function handleRestart() {
    setGameTurns([]);
    socket.emit("reset", roomId);
  }

  return (
    <main>
      <header style={{ textAlign: "center", margin: "1rem" }}>
        <h2>Tic Tac Toe Multiplayer</h2>
        <p>Status: {connectionStatus}</p>
      </header>

      {!joined ? (
        <div className="join-screen">
          <h2>Join Game</h2>
          <p>Select your symbol:</p>
          <button onClick={() => handleJoin("X")}>Play as X</button>
          <button onClick={() => handleJoin("O")}>Play as O</button>
        </div>
      ) : (
        <>
          <div id="game-container">
            <ol id="players" className="highlight-player">
              <Player
                name={players.X}
                symbol="X"
                activePlayer={activePlayer === "X"}
                handlePlayerChange={handlePlayerChange}
              />
              <Player
                name={players.O}
                symbol="O"
                activePlayer={activePlayer === "O"}
                handlePlayerChange={handlePlayerChange}
              />
            </ol>

            {(winner || hasDraw) && (
              <GameOver winner={winner} setGameTurns={handleRestart} />
            )}

            <GameBoard
              playerSelect={handleSelectSquare}
              activePlayer={activePlayer}
              board={gameBoard}
            />
          </div>
          <Log turns={gameTurns} />
        </>
      )}
    </main>
  );
}

export default App;
