import React, { useState } from 'react'

const Player = ({name,symbol,activePlayer,handlePlayerChange}) => {
    const [isEditing , setIsEditing]=useState(false);
    const [playerName , setPlayerName]=useState(name);
    return (
        <li className={activePlayer?'active':undefined}>
            <span className="player">
                {isEditing?
                <input type="text" required value={playerName}
                onChange={(e)=>{
                    setPlayerName(e.target.value)}}
                />:
                <span className="player-name">{playerName}</span>}
                <span className="player-symbol">{symbol}</span>
            </span> 
            <button onClick={()=>{
                setIsEditing((prev)=>!prev)
                isEditing?handlePlayerChange(symbol,playerName):""
            }}>{isEditing?"save":"edit"}</button>
        </li>
    )
}
export default Player