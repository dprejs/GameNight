import React from 'react';
import { Button } from '@mui/material';

const GameCardButton = ({ inLibrary,
  cardStyle,
  removeGameFromLibrary,
  addGameToLibrary,
}) => {


  return (
    <>
      {inLibrary ? <Button
        variant="outlined"
        className="addToLibrary"
        style={cardStyle}
        onClick={removeGameFromLibrary}
        color="inherit"
      >Remove Game</Button> : <Button
        variant="outlined"
        className="addToLibrary"
        style={cardStyle}
        onClick={addGameToLibrary}
        color="inherit"
      >
        Add To Library
      </Button>}
    </>
  )
}

export default GameCardButton;