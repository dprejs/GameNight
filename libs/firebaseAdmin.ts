import admin, { initializeApp } from 'firebase-admin';
const serviceAccount = require('../game-night-2dfb7-firebase-adminsdk-p9y0e-8d9325ad7f.json');
import * as firebase from 'firebase-admin/app';
var app;
if (!firebase.getApps().length) {
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })

}else {
  app = firebase.getApp()
}

export default app;