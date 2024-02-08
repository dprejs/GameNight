import React, { FC, useContext, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { ExpandMoreRounded } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
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
import Image from 'next/image';


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
  const [libraryIsLoading, setLibraryIsLoading] = useState(false);
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
  const [userDisplay, setUserDisplay] = useState({
    displayName: '',
    photoURL: '/icons8-male-user-48.png',
  });
  const [moreSearchResults, setMoreSearchResults] = useState(false);
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchIds, setSearchIds] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
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
      axios.get(`../api/users/getUserDisplay/?uid=${router.query.uid}`).then((res) => {
        if(res.data.photoURL) {
          setUserDisplay({
            displayName: res.data.displayName,
            photoURL: res.data.photoURL,
          })
        } else {
          setUserDisplay({
            displayName: res.data.displayName,
            photoURL: '/icons8-male-user-48.png',
          })
        }
      }).catch((err) => {
        console.log(err);
      })
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

  const formatGame = (rawGame) => {
    let game = {
      id: rawGame.attributes.id,
      name: "",
      year_published: "",
      min_players: 0,
      max_players: 0,
      image_url: "/catan.png",
      min_playtime: 0,
      max_playtime: 0,
      description: "",
      min_age: 0
    }

    rawGame.elements.forEach((item) => {
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
      } else if (item.name === "minage") {
        game.min_age = item.attributes.value;
      }
    })
    return game;
  }
  const parseGameCard = (res, keep:boolean) => {
    const data = convert.xml2js(res.data).elements[0].elements
    let results = search.results
    if (keep) {
      results = [...results, ...data.map(formatGame)]
    } else {
      results = data.map(formatGame)
      const resultsDiv = document.getElementsByClassName("searchResults")
      resultsDiv[0].scrollTop = 0
    }
    setSearchLoading(false);
    setSearch({
      ...search,
      results: results
    });
  }


  //searches third party api for games on form submit
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setSearchLoading(true);
    axios.get(`https://www.boardgamegeek.com/xmlapi2/search?query=/${search.input}&type=boardgame,boardgameexpansion`)
      .then((res) => {
        let ids = {};
        convert.xml2js(res.data).elements[0].elements.forEach((element) => {
          ids[element.attributes.id] = true;
        })
        const idsArray = Object.keys(ids)
        setSearchIds(idsArray);
        if (idsArray.length > 10) {
          setMoreSearchResults(true)
          setSearchIndex(10)
        }
        axios.get(`https://www.boardgamegeek.com/xmlapi2/thing?id=${idsArray.slice(0,10).toString()}`)
          .then((res) => parseGameCard(res, false))
          .catch((err) => {
            console.log('error getting search details', err);
          })

      })
      .catch((err) => {
        console.log('error getting search results', err);
      });
  };
  const moreResults = (event) =>{
    event.preventDefault()
    console.log('searchIndex', searchIndex);
    console.log('searchIds', searchIds);
    const newIndex = searchIndex + 10;
    if (newIndex >= searchIds.length) {
      setMoreSearchResults(false)
    }
    axios.get(`https://www.boardgamegeek.com/xmlapi2/thing?id=${searchIds.slice(searchIndex, newIndex).toString()}`)
    .then((res) => parseGameCard(res,true))
    .then(()=>{
      setSearchIndex(newIndex)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const getLibrary = () => {
    if(uid) {
      setLibraryIsLoading(true)
      axios.get(`/../api/library/?uid=${uid}`)
        .then((res) => {
          setLibraryIsLoading(false)
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
      <div className='libraryBody'>
        <div className='libraryHead'>
      <h1 className="libraryHeader">
        <div className='ProfileToken'>
          <span className='profilePicture'>
            <Image
              src={'https://lh3.googleusercontent.com/a-/AOh14GhASFY7xAcGlyHq4mHraFXrKvWbnyjFJ-gq5GzV6A=s96-c'}
              alt={`${userDisplay.displayName} profile picture`}
              style={{borderRadius: 90, display: 'flex', justifySelf: 'center'}}
              width={25}
              height={25}
            />
          </span>
          <span className='profileName'>
            {userDisplay.displayName}
          </span>
        </div>
        <span>
        Library
        </span>
        <span className='break'></span>
        <span>
        {library.length} games
        </span>
      </h1>
      {isLibraryOwner ?
      <Button
        variant="outlined"
        onClick={handleOpen} className={device.isMobile ? "addGame mobile" : "addGame"}
        endIcon={<AddCircleOutlineRoundedIcon />}
        color="inherit"
        style={{ ...buttonStyle, marginRight: '5px', marginTop: '21.44px' }}
      >
        Add Game
      </Button>
      : null
    }
        </div>
      <div className="gameList">
        {libraryIsLoading ? <GameCard isPlaceholder={true} /> : null}
        {library.filter(applyFilters).map((game, index) => <GameCard
          key={game.id}
          inLibrary={library.some(i => i.id === game.id)}
          game={game}
          updateList={() => removeGameByIndex(index)}
          isLibraryOwner={isLibraryOwner}
        />)}
      </div>
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
                }} />
              <IconButton aria-label='search-games' type="submit">
                <SearchRoundedIcon />
              </IconButton>
            </form>
            {searchLoading ?
            <CircularProgress color='secondary'/>
            : null}
            <div className="searchResults">
              {search.results.map((game) => <GameCard
                key={game.id}
                game={game}
                inLibrary={library.some(i => i.id === game.id)}
                isLibraryOwner={isLibraryOwner}
                updateLibrary={addGameToList}
                updateList={() => removeGameById(game.id)}
              />)}
              <div className='searchPagination'>
                  {moreSearchResults ?
                  <Button
                    variant='outlined'
                    endIcon={<ExpandMoreRounded />}
                    onClick={moreResults}
                    color='inherit'
                    className='iconButton'
                    style={buttonStyle}>
                    More Results
                  </Button>:
                  null
                }
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Library;
