import React, { FC, useContext, useState } from 'react';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import MuiInput from '@mui/material/Input';
import Button from '@mui/material/Button';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { KeyboardArrowDownRounded, KeyboardArrowUpRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
const Input = styled(MuiInput)`
width: 42px;
`;

function valuetext(value: number) {
  return `${value} minutes`;
}
const LibraryFilter: FC<any> = ({ filter, setFilter, setLibrary, filterSearch, setFilterSearch, filterLength, setFilterLength, filterAge, setFilterAge, filterCategory, setFilterCategory, filterPlayers, setFilterPlayers, groupCategory, setGroupCategory }) => {

  const [currentSort, setCurrentSort] = useState(['name', 'ASC']);

  const handleBlur = () => {
    if (filterLength < 0) {
      setFilterLength(0);
    } else if (filterLength > 480) {
      setFilterLength(480);
    }
  }


  const resetFilters = (event) => {
    event.preventDefault();
    setFilterSearch('');
    setFilterPlayers(0);
    setFilterLength(480);
    setFilterAge(0);
    setFilterCategory([]);
    setGroupCategory(false);
    setCurrentSort(['name', 'ASC'])
    sortLibrary('name', 'ASC', false)
  }

  const handleCategoryFilter = (value) => {
    const valueIndex = filterCategory.indexOf(value)
    if (valueIndex === -1) {
      setFilterCategory([...filterCategory, value])
    } else {
      setFilterCategory([...filterCategory.slice(0, valueIndex), ...filterCategory.slice(valueIndex + 1)])
    }
  }

  const sortLibrary = (sortBy, order, group=groupCategory) => {
    axios.get(`../api/library?&sortBy=${sortBy}&order=${order}&group=${group}`).then((res) => {
      setLibrary(res.data);
    })
      .catch((err) => {
        console.log(err);
      })
  }

  return (
      <div className="libraryFilter">
        <h2 className="filterHeader">
          Filter
        </h2>
        <div className="filterDivider" />
        <div>
          Search
          <input type="text"
            name="search"
            placeholder="Search Games"
            onChange={e => setFilterSearch(e.target.value)}
            value={filterSearch}
          />
        </div>
        <div className="filterDivider" />
        <div>
          Number of Players
          <input type="number"
            min="1"
            name="numPlayers"
            placeholder="Enter number of Players"
            onChange={e => setFilterPlayers(e.target.value)}
            value={filterPlayers}
          />
        </div>
        <div className="filterDivider" />
        <div>
          Game Length (mins)
          <Grid container spacing={2} alignItems="center">
            <Grid item xs>
              <Slider
                value={typeof filterLength === 'number' ? filterLength : 0}
                min={0}
                max={480}
                step={10}
                sx={{
                  color: 'black'
                }}
                onChange={(e, val) => setFilterLength(val)}
                aria-labelledby="input-slider"
              />
            </Grid>
            <Grid item>
              <Input
                value={filterLength}
                size="small"
                onChange={e => setFilterLength(e.target.value)}
                onBlur={handleBlur}
                inputProps={{
                  step: 10,
                  min: 0,
                  max: 480,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
              />
            </Grid>
          </Grid>
        </div>
        <div className="filterDivider" />
        <div>
          Youngest Player
          <input
            min="1"
            placeholder="age of youngest player"
            type="number"
            name="youngPlayer"
            onChange={e => setFilterAge(e.target.value)}
            value={filterAge}
          />
        </div>
        <div className="filterDivider" />
        <div>
          <div>Category</div>
          <div className='filterCategory'>
            <button className={`location Lighter ${filterCategory.includes("Lighter") ? "selected" : ""}`} onClick={e => handleCategoryFilter("Lighter")}>Lighter</button>
            <button className={`location Standard ${filterCategory.includes("Standard") ? "selected" : ""}`} onClick={e => handleCategoryFilter("Standard")}>Standard</button>
            <button className={`location Advanced ${filterCategory.includes("Advanced") ? "selected" : ""}`} onClick={e => handleCategoryFilter("Advanced")}>Advanced</button>
            <button className={`location two-Player ${filterCategory.includes("two-Player") ? "selected" : ""}`} onClick={e => handleCategoryFilter("two-Player")}>2-Player</button>
            <button className={`location Party ${filterCategory.includes("Party") ? "selected" : ""}`} onClick={e => handleCategoryFilter("Party")}>Party</button>
            <button className={`location Co-Op ${filterCategory.includes("Co-Op") ? "selected" : ""}`} onClick={e => handleCategoryFilter("Co-Op")}>Co-Op</button>
          </div>
        </div>
        <div className="filterDivider" />
        <Button
          variant="outlined"
          color="inherit"
          className="resetButton"
          onClick={resetFilters}
        >
          Reset Filters
        </Button>
        <div className="filterDivider" />
        <h2 className="filterHeader">
          Sort by
        </h2>
        <div className="filterDivider" />
        <div>
          Name <IconButton aria-label='name ASC'
            onClick={() => {
              sortLibrary('name', 'ASC')
              setCurrentSort(['name', 'ASC'])
            }}
            className="link"><KeyboardArrowUpRounded /></IconButton> | <IconButton aria-label='name DESC'
              onClick={() => {
                sortLibrary('name', 'DESC')
                setCurrentSort(['name', 'DESC'])
              }}
              className="link"><KeyboardArrowDownRounded /></IconButton>
        </div>
        <div className="filterDivider" />
        <div>
          Players <IconButton aria-label='players ASC'
            onClick={() => {
              sortLibrary('min_players', 'ASC')
              setCurrentSort(['min_players', 'ASC'])
            }}
            className="link"><KeyboardArrowUpRounded /></IconButton> | <IconButton aria-label='players DESC'
              onClick={() => {
                sortLibrary('max_players', 'DESC')
                setCurrentSort(['max_players', 'DESC'])
              }}
              className="link"><KeyboardArrowDownRounded /></IconButton>
        </div>
        <div className="filterDivider" />
        <div>
          PlayTime <IconButton aria-label='playtime ASC'
            onClick={() => {
              sortLibrary('min_playtime', 'ASC')
              setCurrentSort(['min_playtime', 'ASC'])
            }}
            className="link"><KeyboardArrowUpRounded /></IconButton> | <IconButton aria-label='playtime DESC'
              onClick={() => {
                sortLibrary('max_playtime', 'DESC')
                setCurrentSort(['max_playtime', 'DESC'])
              }}
              className="link"><KeyboardArrowDownRounded /></IconButton>
        </div>
        <div className="filterDivider" />
        <h2>Group by</h2>
        <div className="filterDivider" />
        <div className='group'>
          <span>
            Category:
          </span>
          <Checkbox
            checked={groupCategory}
            onChange={e => {
              sortLibrary(currentSort[0] ,currentSort[1], e.target.checked)
              setGroupCategory(e.target.checked)
            } }
            inputProps={{ "aria-label": 'controlled' }}
            color='secondary'
          />
        </div>
      </div>
  );
};

export default LibraryFilter;
