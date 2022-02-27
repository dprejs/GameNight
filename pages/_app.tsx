import '../styles/globals.css';
import '../styles/gameCard.css';
import React from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <div>
        <h1>Game Night</h1>
        <Tooltip title="open menu">
          <IconButton
            onClick={handleClick}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
        >
          <MenuItem>
            <Link href="/library">
              <a>
                Library
              </a>
            </Link>
          </MenuItem>
          <MenuItem>
            Profile
          </MenuItem>
          <MenuItem>
            <Link href="/">
              <a>
                Home
              </a>
            </Link>
          </MenuItem>
        </Menu>
      </div>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
