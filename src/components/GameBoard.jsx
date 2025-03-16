import React, { useState } from 'react';

const GameBoard = ({ playerSelect , board}) => {
  
  return (
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((PlayerSymbol, colIndex) => (
              <li key={colIndex}>
                <button onClick={() => { playerSelect(rowIndex, colIndex) }}
                  disabled={PlayerSymbol !== null}>
                  {PlayerSymbol}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
};

export default GameBoard;
