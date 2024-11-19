import admin, { initializeApp } from 'firebase-admin';
import * as firebase from 'firebase-admin/app';
import fs from "fs"
var app;
if (!firebase.getApps().length) {
  // if (process.env.SERVICE_ACCOUNT) {
    app = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT)),
    })
  // } else {
    // if (fs.existsSync('../game-night-2dfb7-firebase-adminsdk-p9y0e-8d9325ad7f.json')){
    //   const serviceAccount = require('../game-night-2dfb7-firebase-adminsdk-p9y0e-8d9325ad7f.json');
    //   app = admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    //   })
    // }
  // }

}else {
  app = firebase.getApp()
}

export default app;