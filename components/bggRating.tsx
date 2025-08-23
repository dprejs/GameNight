import { FC } from 'react';

const BggRating: FC<any> = (props) => {
  const float = parseFloat(props.value);
  let color = "green"
  if (float < 8 && float >= 7) {
    color = "blue"
  } else if (float < 7 && float >= 5) {
    color = "purple"
  } else if (float < 5) {
    color = "red"
  }

  return (
    <div className={`hexagon ${color}`}>
      {Math.round(props.value *100) / 100}
    </div>
  )
}

export default BggRating;