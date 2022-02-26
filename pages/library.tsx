import { FC, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import GameCard from '../components/gameCard';
import game from '../mockApiData.json';

const modalBoxStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Library: FC = (props) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <div>
        <h1>
          library
        </h1>
        <GameCard game={game} />
        <button onClick={handleOpen}>Add Game +</button>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box sx={modalBoxStyle}>
            <div>
              <h2>
                Search for Game
              </h2>
              <input type="text"></input>
              <SearchRoundedIcon />
            </div>
          </Box>
        </Modal>
      </div>

    </>
  )

}


export default Library;
