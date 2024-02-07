import games from '../../../database/models/games';
import libraries from '../../../database/models/libraries';
import app from '../../../libs/firebaseAdmin';

const { addGame } = games;
const { addLibraryRelation, getLibraryRelation } = libraries;
export default function handler(req, res) {
  if (req.method === 'POST') {
    if(req.query.uid) {
      const { uid } = req.query;
      const game = req.body.game;
      app.auth().verifyIdToken(req.body.user).then((result) => {
        addGame(game)
        .then(() => {
          return getLibraryRelation(game.id, uid);
        })
        .then((result) => {
          if (result.rows.length < 1) {
            return addLibraryRelation(game.id, uid)
          } else {
            return;
          }
        })
        .then(() => {
          res.status(200).send('done')

        })
        .catch((err) => {
          console.log(err);
          res.status(500).send('error adding game')
        })
      }).catch((err) => {
        console.log(err);
        res.status(401).send('not authorized to modify this library');
      })
    } else {
      res.status(400).send('no user id given')
    }
  } else {
    res.status(400).send('HTTP method not supported');
  }
}