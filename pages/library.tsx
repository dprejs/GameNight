import React, { FC, useContext, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { createTheme } from '@mui/material/styles';
import GameCard from '../components/gameCard';
import LibraryFilter from '../components/libraryFilter';
import modalBoxStyle from '../components/modalStyle';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { cardClasses, IconButton } from '@mui/material';
import game from '../interfaces/game';
import { SwipeableDrawer } from '@mui/material';
import { DeviceContext } from '../contexts/DeviceContext';
import { ArrowForwardIosRounded, CasinoRounded, CloseRounded } from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: {
      light: '#000',
      main: '#000',
      dark: '#F8F8FF',
    },
  },
});

const Library: FC = (props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [library, setLibrary] = useState([]);
  const [search, setSearch] = useState({
    input: '',
    results: [],
  });
  const [filter, setFilter] = useState({
    search: '',
    numPlayers: 0,
    gameLength: 480,
    youngPlayer: 0,
  });
  const user = useContext(AuthContext);
  const device = useContext(DeviceContext)

  //updates state for games search and searches db for game matches
  const handleChange = (event) => {
    event.preventDefault();
    if (search.input.length > 1) {
      axios.get(`/../api/library/gameSearch/?search=${search.input}`)
        .then((response) => {
          setSearch({
            input: event.target.value,
            results: response.data,
          })
        })
        .catch((err) => {
          console.log(err);
          setSearch({
            ...search,
            input: event.target.value,
          });
        });
    } else {
      setSearch({
        ...search,
        input: event.target.value,
      });
    }
  };

  //searches third party api for games on form submit
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    axios.get(`https://api.boardgameatlas.com/api/search?name=${search.input}&client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`)
      .then((res) => {
        setSearch({
          ...search,
          results: res.data.games,
        });
      })
      .catch((err) => {
        console.log('error getting search results', err);
      });
  };

  const getLibrary = () => {
    axios.get(`/../api/library/?uid=${user.uid}`)
      .then((res) => {
        setLibrary(res.data);
      })
      .catch((err) => {
        console.log('error getting library', err)
      })
  }

  const addGameToList = (game: game) => {
    setLibrary([...library, game]);
  }
  //remove game by clicking card in library
  const removeGameByIndex = (gameIndex: number) => {
    setLibrary([...library.slice(0, gameIndex), ...library.slice(gameIndex + 1)]);
  }
  //remove game by clicking card in search result
  const removeGameById = (gameId: string) => {
    setLibrary(library.filter((game) => game.id !== gameId));
  }

  //////////////////////////////////////////////////////
  // Library Filter functions          /////////////////
  /////////////////////////////////////////////////////
  const searchFilter = ({ name }: game): boolean => {
    const regex = new RegExp(filter.search, 'i');
    return regex.test(name);
  };

  const playersFilter = ({ max_players, min_players }: game): boolean => max_players >= filter.numPlayers && min_players <= filter.numPlayers;

  const lengthFilter = ({ min_playtime }: game): boolean => {
    return min_playtime <= filter.gameLength;
  }

  const ageFilter = ({ min_age }: game): boolean => min_age <= filter.youngPlayer;

  const applyFilters = ((game: game): boolean => {
    if (filter.search.length > 1 && !searchFilter(game)) {
      return false;
    } else if (filter.numPlayers && !playersFilter(game)) {
      return false;
    } else if (filter.gameLength < 480 && !lengthFilter(game)) {
      return false;
    } else if (filter.youngPlayer && !ageFilter(game)) {
      return false;
    } else {
      return true;
    }
  });

  //gives time to load user from firebase if not logged in redirects to login page
  const [userUpdateCount, setUserUpdateCount] = useState(0);
  useEffect(() => {
    if (user) {
      getLibrary();
    } else {
      if (userUpdateCount >= 1) {
        router.push('../login')
      } else {
        setTimeout(() => {
          setUserUpdateCount((count) => count + 1);
        }, 1000);
      }
    }
  }, [user, userUpdateCount]);

  type Anchor = 'top' | 'left' | 'bottom' | 'right';
  const [drawer, setDrawer] = useState(false);
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setDrawer(open);
      };

  return (
    <div id="library">
      <h1 className="libraryHeader">
        Library
      </h1>
      {device.isMobile ?
        <div className='drawer' >
          <Button
            variant="outlined"
            endIcon={<ArrowForwardIosRounded />}
            onClick={toggleDrawer('left', true)}
            color='inherit'
            className='iconButton'
          >
            Filter Games
          </Button>
          <SwipeableDrawer
            anchor={'left'}
            open={drawer}
            onClose={toggleDrawer('left', false)}
            onOpen={toggleDrawer('left', true)}
          >
            <LibraryFilter filter={filter} setFilter={setFilter} setLibrary={setLibrary} />
          </SwipeableDrawer>
        </div> :
        <LibraryFilter filter={filter} setFilter={setFilter} setLibrary={setLibrary} />
      }
      <div className="gameList">
        {library.filter(applyFilters).map((game, index) => <GameCard
          key={game.id}
          inLibrary={library.some(i => i.id === game.id)}
          game={game}
          updateList={() => removeGameByIndex(index)}
        />)}
      </div>
      <div
        className={device.isMobile ? "addGame mobile" : "addGame"}
      >
        <Button
          variant="outlined"
          onClick={handleOpen}
          endIcon={<AddCircleOutlineRoundedIcon />}
          color="inherit"
        >
          Add Game
        </Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={modalBoxStyle}>
          <div id="game-search-modal">
            <IconButton
              className='upperRight'
              aria-label='close game search modal'
              onClick={handleClose}>
              <CloseRounded />
            </IconButton>
            <h2 className="search-header">
              <span >
                Search for Game
              </span>
              <span>
                <CasinoRounded />
              </span>
            </h2>
            <form onSubmit={handleSearchSubmit}>
              <input type="text"
              onChange={handleChange}
              placeholder="Enter Game Name"
              style={{
                fontSize: 'larger',
                marginBottom: '15px'
              }}/>
              <IconButton aria-label='search-games' type="submit">
                <SearchRoundedIcon />
              </IconButton>
            </form>
            <div className="searchResults">
              {search.results.map((game) => <GameCard
                key={game.id}
                game={game}
                inLibrary={library.some(i => i.id === game.id)}
                updateLibrary={addGameToList}
                updateList={() => removeGameById(game.id)}
              />)}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Library;
