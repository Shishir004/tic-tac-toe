import React from 'react'

const GameOver = ({winner,setGameTurns}) => {
    const restartHandler=()=>{
        setGameTurns([]);
    }
  return (
    <div id='game-over'>
      <h2>  GameOver </h2> 
      {winner?<p>{winner} won !!</p>:""}
      {!winner?<p>Game Drawn</p>:""}
      <p>{<button onClick={restartHandler}>Rematch</button>}</p>
    </div>
  )
}

export default GameOver