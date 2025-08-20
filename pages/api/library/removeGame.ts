import games from '../../../database/models/games';

const { deleteGame } = games

export default function handler(req, res) {
  if (req.method === 'DELETE') {
    if (req.query.id) {
      const { id } = req.query;
      deleteGame(id)
        .then(() => {
          res.status(200).send('success')
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send('error removing game')
        })
    } else {
      res.status(400).send('missing game id')
    }
  } else {
    res.status(400).send('HTTP method not supported');
  }
}