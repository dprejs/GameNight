import React, { FC, useState } from 'react';
import Image from 'next/image';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
// import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import parse from 'html-react-parser';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import modalBoxStyle from './modalStyle';
// import '../styles/gameCard.css';

const GameCard: FC = ({ game }) => {
  const [isFavorite, setFavorite] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="gameCard">
      <div
        className="gameImage"
      >
        <Image
          src={game.image_url}
          alt={`${game.name} image`}
          width={250}
          height={250}
        // layout="fill"
        />
      </div>
      <IconButton
        aria-label="add to favorites"
        color="primary"
        className="favoriteButton"
        onClick={() => setFavorite(!isFavorite)}
      >
        {isFavorite ? <FavoriteRoundedIcon fontSize="large" /> : <FavoriteBorderRoundedIcon fontSize="large" />}
      </IconButton>
      <div className="gameName">
        {game.name}
      </div>
      <div className="gamePlayers">
        {game.min_players}
        -
        {game.max_players}
        Players
      </div>
      <div className="cardDivider" />
      {/* <Divider className="cardDivider"/> */}
      <div className="gameTime">
        {game.min_playtime}
        - {game.max_playtime} minutes
      </div>
      <div className="gameAge">
        Ages {game.min_age}+
      </div>
      <div className="gameDescription">
        {parse(game.description)}
      </div>
      <Button
        variant="outlined"
        className="detailButton"
        onClick={handleOpen}
      >
        More Details
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={modalBoxStyle}>
          <div>
            Published {game.year_published}
          </div>
          <div>
            {parse(game.description)}
          </div>
        </Box>
      </Modal>
    </div>

  );
};

export default GameCard;
