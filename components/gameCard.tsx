import React, { FC, useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
// import Divider from '@mui/material/Divider';
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
import Link from 'next/link';
import { CloseRounded } from '@mui/icons-material';
// import '../styles/gameCard.css';


const GameCard: FC<any> = (props) => {
  const { game } = props;
  const [isFavorite, setFavorite] = useState(false);
  const [open, setOpen] = useState(false);
  const [inLibrary, setInLibrary] = useState(props.inLibrary)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useContext(AuthContext);
  const oneGameTime = game.min_playtime === game.max_playtime;

  const addGameToLibrary = () => {
    axios.post(`/../api/library/addGame/?uid=${user.uid}`, game);
    setInLibrary(true);
    props.updateLibrary(game);
  }

  const removeGameFromLibrary = () => {
    console.log('delete')
    console.log('user:', user.uid, 'game', game.id)
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
        className="detailButton cardButton"
        onClick={handleOpen}
        color="inherit"
      >
        More Details
      </Button>
      {inLibrary ? <Button
        variant="outlined"
        className="addToLibrary cardButton"
        onClick={removeGameFromLibrary}
        color="inherit"
      >Remove Game</Button> : <Button
        variant="outlined"
        className="addToLibrary cardButton"
        onClick={addGameToLibrary}
        color="inherit"
      >
        Add To Library
      </Button>}
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
            <span className="game-links">
              <a href={game.official_url} target="_blank">
                Official Game Website
              </a>
              <a href={game.rules_url} target="_blank">
                Game Rule Book
              </a>
            </span>
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
