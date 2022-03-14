import React, { FC, useState, useRef, useContext } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import firebaseui from 'firebaseui';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../components/firebase';
import { useAuth } from '../contexts/AuthContext';
import { DeviceContext } from '../contexts/DeviceContext';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const provider = new GoogleAuthProvider();

const TabPanel: FC = (props: TabPanelProps) => {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}

    </div>
  );
};

const LoginPage: FC = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const [tabValue, setTabValue] = useState(0);
  const [signUp, setSignUp] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [signIn, setSignIn] = useState({
    email: '',
    password: '',
  })
  const device = useContext(DeviceContext);

  const handleChange = (event, newValue) => {
    event.preventDefault();
    setTabValue(newValue);
  };

  const signUpHandleChange = (event) => {
    event.preventDefault();
    setSignUp({
      ...signUp,
      [event.target.name]: event.target.value,
    })
  };

  const signInHandleChange = (event) => {
    event.preventDefault();
    setSignIn({
      ...signIn,
      [event.target.name]: event.target.value,
    })
  }

  const signUpSubmit = (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, signUp.email, signUp.password)
      .then(() => console.log('created'))
      .catch((err) => console.log(err.message));
  };

  const signInSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, signIn.email, signIn.password)
    .catch((error) => {
      console.log(error);
    })
  };

  const googleSignIn = (event) => {
    if(device.isMobile || device.isTablet) {
      signInWithRedirect(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const { user } = result;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(errorCode, errorMessage);
        });
    } else {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const { user } = result;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(errorCode, errorMessage);
        });
    }
  };

  return (
    <div id="loginPage">
      <div className="loginBox">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChange}>
              <Tab label="Login" id="login-tabpanel-0" />
              <Tab label="Sign up with email" id="login-tabpanel-1" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <form className="loginPanel" onSubmit={signInSubmit}>
              <h2>
                Login
              </h2>
              <label htmlFor="loginEmail">
                Email
              </label>
              <input
                type="email"
                ref={emailRef}
                id="loginEmail"
                placeholder="email@address.com"
                name="email"
                required
                onChange={signInHandleChange}
              />
              <label htmlFor="loginPassword">
                Password
              </label>
              <input
                type="password"
                ref={passwordRef}
                name="password"
                id="loginPassword"
                placeholder="Enter your password"
                required
                onChange={signInHandleChange}
              />
              <button type="submit">Login</button>
              <button type="button" onClick={googleSignIn}>sign in with google</button>
            </form>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={signUpSubmit} className="loginPanel">
              <h2>
                Sign Up
              </h2>
              <label htmlFor="signUpEmail">
                Email
              </label>
              <input
                type="email"
                ref={emailRef}
                name="email"
                id="signUpEmail"
                placeholder="email@address.com"
                value={signUp.email}
                onChange={signUpHandleChange}
                required
              />
              <label htmlFor="signUpPassword">
                Password
              </label>
              <input
                type="password"
                ref={passwordRef}
                name="password"
                id="signUpPassword"
                placeholder="Enter password"
                value={signUp.password}
                onChange={signUpHandleChange}
                required
              />
              <label htmlFor="signUpPasswordConfirm">
                Password confirm
              </label>
              <input
                type="password"
                ref={passwordConfirmRef}
                name="passwordConfirm"
                id="signUpPasswordConfirm"
                placeholder="confirmPassworda"
                value={signUp.passwordConfirm}
                onChange={signUpHandleChange}
                required
              />
              <button type="submit">
                submit
              </button>

            </form>
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default LoginPage;
