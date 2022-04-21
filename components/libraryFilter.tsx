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

const Input = styled(MuiInput)`
width: 42px;
`;

function valuetext(value: number) {
  return `${value} minutes`;
}
const LibraryFilter: FC<any> = ({ filter, setFilter, setLibrary }) => {
  const [value, setValue] = React.useState<number | string | Array<number | string>>(
    480,
  );
  const user = useContext(AuthContext);
  const handleChange = (event: Event, newValue: number | number[]) => {
    setFilter({
      ...filter,
      gameLength: newValue,
    })
    setValue(newValue)
  };

  const handleSliderNumChange = (event) => {
    setFilter({
      ...filter,
      gameLength: event.target.value,
    })
    setValue(event.target.value === '' ? '' : Number(event.target.value))
  }

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 480) {
      setValue(480);
    }
  }

  const filterChange = (event) => {
    event.preventDefault();
    setFilter({
      ...filter,
      [event.target.name]: event.target.value,
    });
  }

  const resetFilters = (event) => {
    event.preventDefault();
    setFilter({
      search: '',
      numPlayers: 0,
      gameLength: 480,
      youngPlayer: 0
    })
  }

  const sortLibrary = (sortBy, order) => {
    axios.get(`../api/library?uid=${user.uid}&sortBy=${sortBy}&order=${order}`).then((res) => {
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
          onChange={filterChange}
        />
      </div>
      <div className="filterDivider" />
      <div>
        Number of Players
        <input type="number"
          min="1"
          name="numPlayers"
          placeholder="Enter number of Players"
          onChange={filterChange}
        />
      </div>
      <div className="filterDivider" />
      <div>
        Game Length (mins)
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Slider
              // aria-label="Game length"
              // getAriaValueText={valuetext}
              // valueLabelDisplay="auto"
              value={typeof value === 'number' ? value : 0}
              min={0}
              max={480}
              step={10}
              sx={{
                color: 'black'
              }}
              onChange={handleChange}
              aria-labelledby="input-slider"
            />
          </Grid>
          <Grid item>
            <Input
              value={value}
              size="small"
              onChange={handleSliderNumChange}
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
          onChange={filterChange} />
      </div>
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
        onClick={() => sortLibrary('name', 'ASC')}
        className="link"><KeyboardArrowUpRounded /></IconButton> | <IconButton aria-label='name DESC'
        onClick={() => sortLibrary('name', 'DESC')}
        className="link"><KeyboardArrowDownRounded /></IconButton>
      </div>
      <div className="filterDivider" />
      <div>
        Players <IconButton aria-label='players ASC'
        onClick={() => sortLibrary('min_players', 'ASC')}
        className="link"><KeyboardArrowUpRounded /></IconButton> | <IconButton aria-label='players DESC'
        onClick={() => sortLibrary('max_players', 'DESC')}
        className="link"><KeyboardArrowDownRounded /></IconButton>
      </div>
      <div className="filterDivider" />
      <div>
        PlayTime <IconButton aria-label='playtime ASC'
        onClick={() => sortLibrary('min_playtime', 'ASC')}
        className="link"><KeyboardArrowUpRounded /></IconButton> | <IconButton aria-label='playtime DESC'
        onClick={() => sortLibrary('max_playtime', 'DESC')}
        className="link"><KeyboardArrowDownRounded /></IconButton>
      </div>
    </div>
  );
};

export default LibraryFilter;
