import React, { FC, useState } from 'react';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import { createTheme } from '@mui/material/styles';
import GameCard from '../components/gameCard';
import LibraryFilter from '../components/libraryFilter';
import game from '../mockApiData.json';
import modalBoxStyle from '../components/modalStyle';

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
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [search, setSearch] = useState({
    input: '',
    results: [],
  });
  const handleChange = (event) => {
    event.preventDefault();
    setSearch({
      ...search,
      input: event.target.value,
    });
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    axios.get(`https://api.boardgameatlas.com/api/search?name=${search.input}&client_id=hXGvhv0QR7`)
      .then((res) => {
        setSearch({
          ...search,
          results: res.data.games,
        });
        console.log(res.data.games);
      })
      .catch((err) => {
        console.log('error getting search results', err);
      });
  };

  return (
    <div id="library">
      <h1 className="libraryHeader">
        Library
      </h1>
      <LibraryFilter />
      <GameCard game={game} />
      <div
        className="addGame"
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
          <div>
            <h2>
              Search for Game
            </h2>
            <form onSubmit={handleSearchSubmit}>
              <input type="text" onChange={handleChange} />
              <SearchRoundedIcon />
            </form>
            <div className="searchResults">
              {search.results.map((game) => <GameCard game={game} />)}
            </div>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Library;
