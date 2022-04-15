import React, { FC } from 'react';
import GameCard from './gameCard';

const GameList:FC = ({ list }) => {

  return (
    <div className="gameList">
      {list.map((game) => <GameCard inLibrary={true} game={game}/>)}
    </div>
  )
}

export default GameList;