import React, {
  createContext, useContext, useEffect, useState, useMemo,
} from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../components/firebase';

export const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(undefined);

  const signUp = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((user) => setCurrentUser(user))
      .catch((error) => {
        console.log(error.message);
      });
  };

  const value = useMemo(() => ({ currentUser, signUp }), []);

  onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
  });

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setCurrentUser(user);
  //   });
  //   return unsubscribe;
  // }, []);

  return (
    <AuthContext.Provider value={currentUser}>
      {children}
    </AuthContext.Provider>
  );
};
