import React, { FC, useState } from 'react';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import MuiInput from '@mui/material/Input';
import Button from '@mui/material/Button';

const Input = styled(MuiInput)`
width: 42px;
`;

function valuetext(value: number) {
  return `${value} minutes`;
}
const LibraryFilter: FC<any> = ({ filter, setFilter }) => {
  const [value, setValue] = React.useState<number | string | Array<number | string>>(
    480,
  );

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
    </div>
  );
};

export default LibraryFilter;
