/* eslint-disable react/jsx-props-no-spreading */
import '../styles/globals.css';
import '../styles/library.css';
import '../styles/login/login.css';
import React from 'react';

import DeviceContextProvider from '../contexts/DeviceContext';
import {AuthProvider} from '../contexts/AuthContext';
import Head from 'next/head';
import theme from '../components/mui/themes';
import { ThemeProvider } from '@mui/material';
import Header from '../components/header';

function MyApp({ Component, pageProps }) {
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
            <Header />
          </div>

          <Component {...pageProps} />
        </ThemeProvider>
      </AuthProvider>
    </DeviceContextProvider>
  );
}

export default MyApp;
