import app from '../../../libs/firebaseAdmin';

export const config = {
  api: {
    externalResolver: true,
  },
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    if (req.query.uid) {
      const { uid } = req.query;
      app.auth().getUser(uid)
      .then((user) => {
        const display = {
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: uid,
        }
        res.status(200).send(display);
      })
    } else [
      res.status(400).send('no user id given')
    ]
  } else {
    res.status(400).send('HTTP method not supported');
  }
}
