import React, { FC, useContext, useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import Button from '@mui/material/Button';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import GameCard from '../components/gameCard';
import LibraryFilter from '../components/libraryFilter';
import game from '../interfaces/game';
import { SwipeableDrawer } from '@mui/material';
import { DeviceContext } from '../contexts/DeviceContext';
import { ArrowForwardIosRounded } from '@mui/icons-material';
import EditForm from '../components/editGameForm';
import { useAuth } from '../contexts/AuthContext';


const buttonStyle = {
  backgroundColor: 'var(--white)',
  color: 'black',
  border: '1px solid black',
  borderRadius: '10px',
  fontSize: 'small',
}

const Library: FC = () => {
  const [editGameOpen, setEditGameOpen] = useState(false);
  const [selectedGameEdit, setSelectedGameEdit] = useState({});
  const [library, setLibrary] = useState([]);
  const [libraryIsLoading, setLibraryIsLoading] = useState(false);
  const [filterSearch, setFilterSearch] = useState("");
  const [filterPlayers, setFilterPlayers] = useState(0);
  const [filterLength, setFilterLength] = useState(480);
  const [filterAge, setFilterAge] = useState(0);
  const [filterCategory, setFilterCategory] = useState([]);
  const [groupCategory, setGroupCategory] = useState(false)
  const {adminMode} = useAuth();
  const device = useContext(DeviceContext)

  const getLibrary = () => {
    if (true) {
      setLibraryIsLoading(true)
      axios.get(`/../api/library/`)
        .then((res) => {
          console.log(res);
          setLibraryIsLoading(false)
          setLibrary(res.data);
        })
        .catch((err) => {
          console.log('error getting library', err)
        })
    }
  }

  const addGameToList = (game: game) => {
    setLibrary([game, ...library]);
  }
  //remove game by clicking card in library
  const removeGameByIndex = (gameIndex: number) => {
    setLibrary([...library.slice(0, gameIndex), ...library.slice(gameIndex + 1)]);
  }
  //remove game by clicking card in search result
  const removeGameById = (gameId: string) => {
    setLibrary(library.filter((game) => game.id !== gameId));
  }

  const updateGameByIndex = (i: number, game) => {
    setLibrary([...library.slice(0, i), game, ...library.slice(i + 1)])
  }

  //////////////////////////////////////////////////////
  // Library Filter functions          /////////////////
  /////////////////////////////////////////////////////
  const searchFilter = ({ name }: game): boolean => {
    const regex = new RegExp(filterSearch, 'i');
    return regex.test(name);
  };

  const playersFilter = ({ max_players, min_players }: game): boolean => max_players >= filterPlayers && min_players <= filterPlayers;

  const lengthFilter = ({ min_playtime }: game): boolean => {
    return min_playtime <= filterLength;
  }
  const categoryFilter = ({category}: game): boolean => {
    if (category === "2-Player") {
      return filterCategory.includes("two-Player");
    } else {
      return filterCategory.includes(category);
    }
  }

  const ageFilter = ({ min_age }: game): boolean => min_age <= filterAge;

  const applyFilters = ((game: game): boolean => {
    if (filterSearch.length > 1 && !searchFilter(game)) {
      return false;
    } else if (filterPlayers && !playersFilter(game)) {
      return false;
    } else if (filterLength< 480 && !lengthFilter(game)) {
      return false;
    } else if (filterAge && !ageFilter(game)) {
      return false;
    } else if (filterCategory.length && !categoryFilter(game)) {
      return false;
    } else {
      return true;
    }
  });

  //gives time to load user from firebase if not logged in redirects to login page
  useEffect(() => {
      getLibrary()

  }, []);

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
            <LibraryFilter
              filterSearch={filterSearch}
              setFilterSearch={setFilterSearch}
              filterPlayers={filterPlayers}
              setFilterPlayers={setFilterPlayers}
              filterLength={filterLength}
              setFilterLength={setFilterLength}
              filterAge={filterAge}
              setFilterAge={setFilterAge}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              setLibrary={setLibrary} />
          </SwipeableDrawer>
        </div> :
        <LibraryFilter
          setLibrary={setLibrary}
          filterSearch={filterSearch}
          setFilterSearch={setFilterSearch}
          filterPlayers={filterPlayers}
          setFilterPlayers={setFilterPlayers}
          filterLength={filterLength}
          setFilterLength={setFilterLength}
          filterAge={filterAge}
          setFilterAge={setFilterAge}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          groupCategory={groupCategory}
          setGroupCategory={setGroupCategory}
        />
      }
      <div className='libraryBody'>
        <div className='libraryHead'>
          <h1 className="libraryHeader">
            <span>
              Library
            </span>
            <span className='break'></span>
            <span>
              {library.length} games
            </span>
          </h1>
          {adminMode ?
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedGameEdit({})
                setEditGameOpen(true);
              }}
              className={device.isMobile ? "addGame mobile" : "addGame"}
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
            isLibraryOwner={adminMode}
            openEdit={() => {
              setEditGameOpen(true);
              setSelectedGameEdit({ ...game, index: index });
            }}
          />)}
        </div>
      </div>
      <Modal
        open={editGameOpen}
        onClose={() => { setEditGameOpen(false) }}
      >
        {"name" in selectedGameEdit ?
          <EditForm
            game={selectedGameEdit}
            handleClose={() => { setEditGameOpen(false) }}
            updateGameByIndex={updateGameByIndex}
            addGameToList={addGameToList}
          />
          :
          <EditForm
            handleClose={() => { setEditGameOpen(false) }}
            updateGameByIndex={updateGameByIndex}
            addGameToList={addGameToList}
          />
        }
      </Modal>
    </div>
  );
};

export default Library;
