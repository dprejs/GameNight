import React, { FC, useState, useRef, useContext, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../components/firebase';
import { AuthContext } from '../contexts/AuthContext';
import { DeviceContext } from '../contexts/DeviceContext';
import axios from 'axios';
import { useRouter } from 'next/router';
import styles from '../styles/login/login.module.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}



const provider = new GoogleAuthProvider();


//panel for login/sign up tabs
const TabPanel: FC<any> = (props: TabPanelProps) => {
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
    username: '',
  });
  const [signIn, setSignIn] = useState({
    email: '',
    password: '',
  })
  const user = useContext(AuthContext);
  const device = useContext(DeviceContext);
  const router = useRouter();
  const googleStyleParams = {
    margin: '10px',
    display: 'inline-block',
    width: '240px',
    height: '50px',
    backgroundColor: '#4285f4',
    color: '#fff',
    borderRadius: '1px',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.25)',
    transition: 'background-color .218s, border-color .218s, box-shadow .218s',
    // display: 'inline-block',
    // background: 'white',
    // color: '#444',
    // width: '190px',
    // borderRadius: '5px',
    // border: 'thin solid #888',
    // boxShadow: '1px 1px 1px grey',
  };

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
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(auth.currentUser, {
          displayName: signUp.username,
        })
          .catch((err) => {
            console.log('error updating username', err);
          })
        axios.post('/../api/login/createUser', { ...user, username: signUp.username })
          .catch((err) => {
            console.log('error creating user', err);
          })
      })
      .catch((err) => console.log(err.message));
  };

  const signInSubmit = (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, signIn.email, signIn.password)
      .catch((error) => {
        console.log(error);
      })
  };

  const googleSignInApiCall = (user) => {
    axios.post('/../api/login/googleSignIn', user)
      .catch((err) => {
        console.log('error checking user', err);
      })
  }

  useEffect(() => {
    if (user) {
      router.push(`/../library/${user.uid}`);
    }
  }, [user]);

  const googleSignIn = (event) => {
    //login with redirect in mobile browsers
    //login with popup
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const { user } = result;
        googleSignInApiCall(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div id="loginPage">
      <div className="loginBox">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleChange}
            textColor='secondary'
            indicatorColor='secondary'>
              <Tab label="Login" id="login-tabpanel-0" className='login-tab-panel'/>
              <Tab label="Sign up with email" id="login-tabpanel-1"
              className='login-tab-panel'/>
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
              <button className={styles.button} type="submit">Login</button>
              <div onClick={googleSignIn} className={styles.gSignInButton}>
                <div className={styles.contentWrapper}>
                  <div className={styles.logoWrapper}>
                    <img src='https://developers.google.com/identity/images/g-logo.png' />
                  </div>
                  <span className={styles.textContainer}>
                    <span>Sign in with Google</span>
                  </span>
                </div>
              </div>
            </form>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={signUpSubmit} className="loginPanel">
              <h2>
                Sign Up
              </h2>
              <label htmlFor="signUpUserName">
                UserName
              </label>
              <input
                type="text"
                name="username"
                id="signUpUserName"
                placeholder="enter username"
                value={signUp.username}
                onChange={signUpHandleChange}
                required
              />
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
                placeholder="confirmPassword"
                value={signUp.passwordConfirm}
                onChange={signUpHandleChange}
                required
              />
              <button className={styles.button} type="submit">
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
