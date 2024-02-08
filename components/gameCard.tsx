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
import { Skeleton } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { auth } from './firebase';

const GameCard: FC<any> = (props) => {
  const { game, isLibraryOwner, isPlaceholder } = props;
  const [isFavorite, setFavorite] = useState(false);
  const [open, setOpen] = useState(false);
  const [inLibrary, setInLibrary] = useState(props.inLibrary)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useContext(AuthContext);
  let oneGameTime = true
  if (!isPlaceholder) {
    oneGameTime = game.min_playtime === game.max_playtime;
  }

  const cardStyle = {
    fontSize: '.75rem',
    padding: '0px 15px',
    lineHeight: '1',
    height: '30px',
    alignSelf: 'end',
    margin: '0px 4px',
}
  let fontSize = '25px';
  if (!isPlaceholder){
    if (game.name.length > 50){
      fontSize = '15px';
    } else if (game.name.length > 30) {
      fontSize = '20px';
    }
  }

  const addGameToLibrary = () => {
    auth.currentUser.getIdToken(true).then((idtoken) => {
      const req = {
        game: game,
        user:idtoken,
      }
      axios.post(`/../api/library/addGame/?uid=${user.uid}`, req);
      setInLibrary(true);
      props.updateLibrary(game);
    })
    .catch((err) => {
      console.error('Error geting user id token', err);
    })
  }

  const removeGameFromLibrary = () => {
    auth.currentUser.getIdToken(true).then((idToken) => {
      axios.delete(`/../api/library/removeGame/?uid=${user.uid}&game_id=${game.id}&token=${idToken}`)
    })
    props.updateList();
    setInLibrary(false);
  }
  const gameTimeDisplay = (oneGameTime) => {
    return (
    <>
      {oneGameTime ? <SingleTime
        min_playtime={game.min_playtime}
      /> : <TimeRange
        min_playtime={game.min_playtime}
        max_playtime={game.max_playtime}
      />}
    </>
    )

  }
  return (
    <div className="gameCard">
      <div
        className="gameImage"
      >
        {isPlaceholder ? <CircularProgress
        size={175}
        thickness={5}
        color='secondary'
        /> :
        <Image
          src={game.image_url}
          alt={`${game.name} image`}
          width={175}
          height={175}
        />
        }
      </div>
      {/* <IconButton
          aria-label="add to favorites"
          color="primary"
          className="favoriteButton"
          onClick={() => setFavorite(!isFavorite)}
        >
          {isFavorite ? <FavoriteRoundedIcon fontSize="large" /> : <FavoriteBorderRoundedIcon fontSize="large" />}
        </IconButton> */}
      <div className="gameName" style={{fontSize:fontSize}}>
        {isPlaceholder ? <Skeleton variant='text' height={70} sx={{fontSize:fontSize, bgcolor:'grey.500'}}/> :
        game.name
        }
      </div>
      <div className="gamePlayers">
        {isPlaceholder ? <Skeleton variant='text' width={50} sx={{bgcolor: 'grey.500'}}/> :
        `${game.min_players}-${game.max_players} Players`
        }
      </div>
      <div className="cardDivider" />
      {isPlaceholder ? null : gameTimeDisplay(oneGameTime)}
      <div className="gameAge">
        {isPlaceholder ? <Skeleton variant='text' width={30} sx={{bgcolor: 'grey.500'}}/> :
        `Ages ${game.min_age}+`
        }
      </div>
      <div className="gameDescription">
        {isPlaceholder ? <Skeleton variant='text' height={180} sx={{bgcolor: 'grey.500', marginTop: '-30px'}}/> :
        parse(game.description)
        }
      </div>
      {isPlaceholder ? null :
      <><Button
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
    </>
      }
      </div>

  );
};

export default GameCard;
