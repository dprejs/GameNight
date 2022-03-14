/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css';
import '../styles/library.css';
import '../styles/login.css';
import React from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { AuthProvider } from '../contexts/AuthContext';
import DeviceContextProvider from '../contexts/DeviceContext';
import { auth } from '../components/firebase';

function MyApp({ Component, pageProps }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    signOut(auth)
      .then(() => console.log('signed out'))
      .catch(error => console.log(error));
  }

  return (
    <DeviceContextProvider>
      <AuthProvider>
        <div className="banner">
          <h1>Game Night</h1>
          <Tooltip title="open menu">
            <IconButton
              onClick={handleClick}
              color="inherit"
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
                Library
              </Link>
            </MenuItem>
            <MenuItem>
              Profile
            </MenuItem>
            <MenuItem>
              <Link href="/">
                Home
              </Link>
            </MenuItem>
            <MenuItem>
              <button type="button" onClick={logout}>
                logout
              </button>
            </MenuItem>
          </Menu>
        </div>
        <Component {...pageProps} />
      </AuthProvider>
    </DeviceContextProvider>
  );
}

export default MyApp;
