/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css';
import '../styles/library.css';
import '../styles/login/login.css';
import React, { useContext, useEffect, useState } from 'react';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Alert, Button, IconButton } from '@mui/material';
import Link from 'next/link';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { AuthContext, AuthProvider } from '../contexts/AuthContext';
import DeviceContextProvider from '../contexts/DeviceContext';
import { auth } from '../components/firebase';
import { LogoutRounded, ShareRounded } from '@mui/icons-material';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Provider } from 'react-redux';
import theme from '../components/mui/themes';
import { ThemeProvider } from '@mui/material';

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
      .then(() => {
        // router.push('/')
      })
      .catch(error => console.log(error));
  }

  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>();
  const [copyAlert, setCopyAlert] = useState(false);

  onAuthStateChanged(auth, (u) => {
    if (u) {
      setLoggedIn(true);
      setUser(u);
    } else {
      setLoggedIn(false);
      setUser(undefined);
    }
  });

  return (
    <DeviceContextProvider>
      <AuthProvider>
        <ThemeProvider theme={theme}>

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
            <h1 className="Title">Good Game Cafe</h1>
          </Link>
        </div>

        <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </DeviceContextProvider>
  );
}

export default MyApp;
