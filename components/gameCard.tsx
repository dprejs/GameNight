import React, { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import parse from 'html-react-parser';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import axios from 'axios';
import modalBoxStyle from './modalStyle';
import { AuthContext } from '../contexts/AuthContext';
import SingleTime from './gamePlayers/singleTime';
import TimeRange from './gamePlayers/timeRange';
import { CloseRounded } from '@mui/icons-material';
import GameCardButton from './gameCardButtons';



const GameCard: FC<any> = (props) => {
  const { game, isLibraryOwner } = props;
  const [isFavorite, setFavorite] = useState(false);
  const [open, setOpen] = useState(false);
  const [inLibrary, setInLibrary] = useState(props.inLibrary)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useContext(AuthContext);
  const oneGameTime = game.min_playtime === game.max_playtime;

  const cardStyle = {
    fontSize: '.75rem',
    padding: '0px 15px',
    lineHeight: '1',
    height: '30px',
    alignSelf: 'end',
    margin: '0px 4px',
}

const addGameToLibrary = () => {
  axios.post(`/../api/library/addGame/?uid=${user.uid}`, game);
  setInLibrary(true);
  props.updateLibrary(game);
}

const removeGameFromLibrary = () => {
  axios.delete(`/../api/library/removeGame/?uid=${user.uid}&game_id=${game.id}`)
  props.updateList();
  setInLibrary(false);
}

return (
  <div className="gameCard">
    <div
      className="gameImage"
    >
      <Image
        src={game.image_url}
        alt={`${game.name} image`}
        width={175}
        height={175}
      />
    </div>
    {/* <IconButton
        aria-label="add to favorites"
        color="primary"
        className="favoriteButton"
        onClick={() => setFavorite(!isFavorite)}
      >
        {isFavorite ? <FavoriteRoundedIcon fontSize="large" /> : <FavoriteBorderRoundedIcon fontSize="large" />}
      </IconButton> */}
    <div className="gameName">
      {game.name}
    </div>
    <div className="gamePlayers">
      {game.min_players}
      -
      {game.max_players} Players
    </div>
    <div className="cardDivider" />
    {oneGameTime ? <SingleTime
      min_playtime={game.min_playtime}
    /> : <TimeRange
      min_playtime={game.min_playtime}
      max_playtime={game.max_playtime}
    />}
    <div className="gameAge">
      Ages {game.min_age}+
    </div>
    <div className="gameDescription">
      {parse(game.description)}
    </div>
    <Button
      variant="outlined"
      className="detailButton"
      style={cardStyle}
      onClick={handleOpen}
      color="inherit"
    >
      More Details
    </Button>
    {isLibraryOwner ?
    <GameCardButton
      inLibrary={inLibrary}
      cardStyle={cardStyle}
      removeGameFromLibrary={removeGameFromLibrary}
      addGameToLibrary={addGameToLibrary}
      /> :
      null
    }
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={modalBoxStyle}>
        <div className="game-details">
          <span className="details-banner">
            <h2>
              {game.name}
            </h2>
            <IconButton aria-label="close details" onClick={handleClose}>
              <CloseRounded />
            </IconButton>
          </span>
          <div className="year-published">
            Published {game.year_published}
          </div>
          <div className="game-description">
            {parse(game.description)}
          </div>
        </div>
      </Box>
    </Modal>
  </div>

);
};

export default GameCard;
