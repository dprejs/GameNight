import React, { FC } from 'react';

const TimeRange = ({ min_playtime, max_playtime }) => {
  return (
    <div className="gameTime">
      {min_playtime}
      - {max_playtime} minutes
    </div>
  )
};

export default TimeRange;