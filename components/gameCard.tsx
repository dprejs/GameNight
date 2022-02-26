import { FC, useState } from 'react';
import Image from 'next/image';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import parse from 'html-react-parser';


const GameCard:FC = (props) => {
  const [isFavorite, setFavorite] = useState(false);
  return (
    <div>
      <Image
      src={props.game.image_url}
      alt={`${props.game.name} image`}
      width={300}
      height={300}
      />
      <IconButton
      aria-label="add to favorites"
      color="primary"
      onClick={() => setFavorite(!isFavorite)}>
        {isFavorite ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon/>}
      </IconButton>
      <div>
        {props.game.name}
      </div>
      <div>
        {props.game.min_players} - {props.game.max_players} Players
      </div>
      <Divider/>
      <div>
        {props.game.min_playtime} - {props.game.max_playtime} minutes
      </div>
      <div>
        Ages {props.game.min_age}+
      </div>
      <div>
        <body>
          {parse(props.game.description)}
        </body>
      </div>
      <Button variant="outlined">Details</Button>

    </div>
  )
}

export default GameCard;