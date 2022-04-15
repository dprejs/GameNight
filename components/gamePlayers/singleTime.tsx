import React, { FC } from 'react';

const SingleTime = ({ min_playtime }) => {
  return (
    <div className="gameTime">
      {min_playtime} minutes
    </div>
  )
};

export default SingleTime;