import libraries from '../../../database/models/libraries';
import app from '../../../libs/firebaseAdmin';

const { removeLibraryRelation } = libraries
export default function handler(req, res) {
  if (req.method === 'DELETE') {
    if (req.query.uid && req.query.game_id && req.query.token) {
      const { uid, game_id } = req.query;
      app.auth().verifyIdToken(req.query.token).then((result) => {
        removeLibraryRelation(game_id, uid)
          .then(() => {
            res.status(200).send('success')
          })
          .catch((err) => {
            console.log(err);
            res.status(500).send('error removing game')
          })
          .catch((err) => {
            console.log(err);
            res.status(401).send('not authorized to modify this library')
          })
      })
    } else {
      res.status(400).send('missing user id or game id or idToken')
    }
  } else {
    res.status(400).send('HTTP method not supported');
  }
}