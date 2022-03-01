import React, { FC, useState } from 'react';
import Slider from '@mui/material/Slider';

function valuetext(value: number) {
  return `${value} minutes`;
}
const LibraryFilter:FC = () => {
  const [value, setValue] = useState<number[]>([20, 37]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number[]);
  };

  return (
    <div>
      <div>
        Filter
      </div>
      <div>
        Search
        <input type="text" />
      </div>
      <div>
        Number of Players
        <input type="number" />
      </div>
      <div>
        Game Length
        <Slider
          getAriaLabel={() => 'Temperature range'}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
        />
      </div>
      <div>
        Youngest Player
        <input type="number" />
      </div>

    </div>
  );
};

export default LibraryFilter;
