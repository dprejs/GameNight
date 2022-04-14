import libraries from '../../../database/models/libraries';

const { removeLibraryRelation } = libraries
export default function handler(req, res) {
  if (req.method === 'DELETE') {
    if (req.query.uid && req.query.game_id) {
      const { uid, game_id } = req.query;
      removeLibraryRelation(game_id, uid)
        .then(() => {
          res.status(200).send('success')

        })
        .catch((err) => {
          console.log(err);
          res.status(500).send('error removing game')
        })
    } else {
      res.status(400).send('missing user id or game id')
    }
  } else {
    res.status(400).send('HTTP method not supported');
  }
}