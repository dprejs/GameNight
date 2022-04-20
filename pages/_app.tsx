/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css';
import '../styles/library.css';
import '../styles/login.css';
import React, { useContext, useEffect, useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Button, IconButton } from '@mui/material';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { AuthContext, AuthProvider } from '../contexts/AuthContext';
import DeviceContextProvider from '../contexts/DeviceContext';
import { auth } from '../components/firebase';
import { LogoutRounded } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Head from 'next/head';

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

  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  });

  return (
    <DeviceContextProvider>
      <AuthProvider>
        <Head>
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
          <meta name="theme-color" content="#ffffff" />
        </Head>
        <div className="banner">
          <Link href='/'>
            <h1 className="Title">Game Night</h1>
          </Link>

          {loggedIn ? <><Tooltip title="open menu">
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
              <MenuItem onClick={() => router.push('/library')}>
                Library
              </MenuItem>
              <MenuItem onClick={() => router.push('/profile')}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => router.push('/')}>
                Home
              </MenuItem>
              <MenuItem onClick={logout}>
                Logout <LogoutRounded />
              </MenuItem>
            </Menu></> : null}
        </div>
        <Component {...pageProps} />
      </AuthProvider>
    </DeviceContextProvider>
  );
}

export default MyApp;
