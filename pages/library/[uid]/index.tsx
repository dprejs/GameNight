import React, { FC, useContext, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { createTheme } from '@mui/material/styles';
import GameCard from '../../../components/gameCard';
import LibraryFilter from '../../../components/libraryFilter';
import modalBoxStyle from '../../../components/modalStyle';
import { AuthContext } from '../../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { IconButton } from '@mui/material';
import game from '../../../interfaces/game';
import { SwipeableDrawer } from '@mui/material';
import { DeviceContext } from '../../../contexts/DeviceContext';
import { ArrowForwardIosRounded, CasinoRounded, CloseRounded } from '@mui/icons-material';
import convert from 'xml-js';

const theme = createTheme({
  palette: {
    primary: {
      light: '#000',
      main: '#000',
      dark: '#F8F8FF',
    },
  },
});

const buttonStyle = {
  backgroundColor: 'var(--white)',
  color: 'black',
  border: '1px solid black',
  borderRadius: '10px',
  fontSize: 'small',
}

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

  // gets uid from url and checks if user owns the library.
  const [uid, setUid] = useState<any>();
  const [isLibraryOwner, setIsLibraryOwner] = useState(false);
  const checkOwnership = () => {
    if (user && user.uid === uid) {
      setIsLibraryOwner(true);
    }
  }
  useEffect(() => {
    if (router.isReady) {
      setUid(router.query.uid);
    }
  }, [router.isReady])


  useEffect(() => {
    checkOwnership();
    getLibrary();
    }, [uid, user]);

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
    axios.get(`https://www.boardgamegeek.com/xmlapi2/search?query=/${search.input}&type=boardgame,boardgameexpansion`)
      .then((res) => {
        // console.log(res.data)
        // console.log(convert.xml2js(res.data).elements[0].elements)
        // const data = convert.xml2js(res.data).elements[0].elements
        let ids = {};
        convert.xml2js(res.data).elements[0].elements.forEach((element) => {
          ids[element.attributes.id] = true;
        })
        axios.get(`https://www.boardgamegeek.com/xmlapi2/thing?id=${Object.keys(ids).toString()}`)
          .then((res)=>{
            const data = convert.xml2js(res.data).elements[0].elements
            const results = data.map((element) => {
              let game = {
                id: element.attributes.id,
                name: "",
                year_published: "",
                min_players: 0,
                max_players: 0,
                image_url: "/catan.png",
                min_playtime: 0,
                max_playtime: 0,
                description: "",
              }

              element.elements.forEach((item) => {
                if (item.name === "name" && item.attributes.type === "primary") {
                  game.name = item.attributes.value;
                } else if (item.name === "description") {
                  game.description = item.elements[0].text;
                } else if (item.name === "yearpublished") {
                  game.year_published = item.attributes.value;
                } else if (item.name === "minplayers") {
                  game.min_players = item.attributes.value;
                } else if (item.name === "maxplayers") {
                  game.max_players = item.attributes.value;
                } else if (item.name === "minplaytime") {
                  game.min_playtime = item.attributes.value;
                } else if (item.name === "maxplaytime") {
                  game.max_playtime = item.attributes.value;
                } else if (item.name === "image") {
                  game.image_url = item.elements[0].text;
                }
              })
              return game;
            })
            setSearch({
              ...search,
              results: results
            });
          })
          .catch((err) => {
            console.log('error getting search details', err);
          })

      })
      .catch((err) => {
        console.log('error getting search results', err);
      });
  };

  const getLibrary = () => {
    if(uid) {
      axios.get(`/../api/library/?uid=${uid}`)
        .then((res) => {
          setLibrary(res.data);
        })
        .catch((err) => {
          console.log('error getting library', err)
        })
    }
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
        setIsLibraryOwner(false);
        // router.push('../login')
      } else {
        setTimeout(() => {
          setUserUpdateCount((count) => count + 1);
        }, 2000);
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
            style={buttonStyle}
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
          isLibraryOwner={isLibraryOwner}
        />)}
      </div>
      {isLibraryOwner ?
      <Button
        variant="outlined"
        onClick={handleOpen} className={device.isMobile ? "addGame mobile" : "addGame"}
        endIcon={<AddCircleOutlineRoundedIcon />}
        color="inherit"
        style={{ ...buttonStyle, marginRight: '5px' }}
      >
        Add Game
      </Button>
      : null
    }
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
                }} />
              <IconButton aria-label='search-games' type="submit">
                <SearchRoundedIcon />
              </IconButton>
            </form>
            <div className="searchResults">
              {search.results.map((game) => <GameCard
                key={game.id}
                game={game}
                inLibrary={library.some(i => i.id === game.id)}
                isLibraryOwner={isLibraryOwner}
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