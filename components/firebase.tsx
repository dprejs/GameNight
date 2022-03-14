import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyBpmM13IJeiXfxf40_AaBSbL0bLeJaBwQM",
  authDomain: "game-night-2dfb7.firebaseapp.com",
  projectId: "game-night-2dfb7",
  storageBucket: "game-night-2dfb7.appspot.com",
  messagingSenderId: "884172076063",
  appId: "1:884172076063:web:6cedecdf481e14bfde112a",
  measurementId: "G-921JHMLXWG"
};

// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID,
// };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export default app;
