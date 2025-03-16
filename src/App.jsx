import { useState } from "react"
import GameBoard from "./components/GameBoard"
import Player from "./components/Player"
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./WinningCombinations";
import GameOver from "./components/GameOver";

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function derivedActivePlayers(gameTurns)
{
  let currentPlayer='X';
  if(gameTurns.length>0 && gameTurns[0].player==='X')
  {
    currentPlayer='O';
  } 
  return currentPlayer;
}
function App() {
  const [players,setPlayers]=useState({
    X:'Player 1',
    Y:'Player 2'
  });
  const [gameTurns , setGameTurns]=useState([]);
  // const [isWinner , setIsWinner]=useState(false);
  const activePlayer=derivedActivePlayers(gameTurns);
  let gameBoard = [...initialGameBoard.map((array)=>[...array])];
  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;
    gameBoard[row][col] = player;
  }
  let winner;
  for( const combinations of WINNING_COMBINATIONS)
  {
    const firstSquareSymbol=gameBoard[combinations[0].row][combinations[0].column]
    const secondSquareSymbol=gameBoard[combinations[1].row][combinations[1].column]
    const thirdSquareSymbol=gameBoard[combinations[2].row][combinations[2].column]
    if(firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && secondSquareSymbol === thirdSquareSymbol)
    {
      winner=players[firstSquareSymbol];
      console.log(winner);
    }
  }
  const hasDraw=gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex , colIndex){
    setGameTurns((prev)=>{
      const currentPlayer=derivedActivePlayers(prev);
      const updatedTurns=[
        {square:{row:rowIndex, col:colIndex},
        player:currentPlayer},...prev]
      return updatedTurns;
    })
  }
  function handlePlayerChange(symbol,newName)
  {
    setPlayers((prev)=>{ return{...prev,[symbol]:newName}})
  }
  return (
    <main>
      <div id='game-container'>
        <ol id="players" className="highlight-player">
          <Player name="Player 1" symbol="X" activePlayer={activePlayer==="X"} handlePlayerChange={handlePlayerChange}/>
          <Player name="Player 2" symbol="O" activePlayer={activePlayer==="O"} handlePlayerChange={handlePlayerChange}/>
        </ol>
        <p>{(winner || hasDraw) ? <GameOver winner={winner} setGameTurns={setGameTurns}/> : ""}</p>
        <GameBoard playerSelect={handleSelectSquare} activePlayer={activePlayer} board={gameBoard}/>
      </div>
      <Log turns={gameTurns}/>
    </main>
  )
}

export default App
