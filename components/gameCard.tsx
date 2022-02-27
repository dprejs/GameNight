import { FC, useState } from 'react';
import Image from 'next/image';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import parse from 'html-react-parser';
// import '../styles/gameCard.css';


const GameCard: FC = (props) => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <div className="gameCard">
      <div
        className="gameImage"
        >
      <Image
        src={props.game.image_url}
        alt={`${props.game.name} image`}
        width={300}
        height={300}
      />
      </div>
      <IconButton
        aria-label="add to favorites"
        color="primary"
        className="favoriteButton"
        onClick={() => setFavorite(!isFavorite)}>
        {isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />}
      </IconButton>
      <div className="gameName">
        {props.game.name}
      </div>
      <div className="gamePlayers">
        {props.game.min_players} - {props.game.max_players} Players
      </div>
      <Divider className="cardDivider"/>
      <div className="gameTime">
        {props.game.min_playtime} - {props.game.max_playtime} minutes
      </div>
      <div className="gameAge">
        Ages {props.game.min_age}+
      </div>
      <div className="gameDescription">
        {parse(props.game.description)}
      </div>
      <Button
        variant="outlined"
        className="detailButton"
      >
        Details
      </Button>

    </div>
  )
}

export default GameCard;