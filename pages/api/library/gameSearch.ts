import games from '../../../database/models/games';

const { searchGames } = games;
export default function handler(req, res) {
  if (req.method === 'GET') {
    if (req.query.search) {
      const { search } = req.query;
      console.log(search);
        searchGames(search)
        .then((result) => {
          res.status(200).send(result.rows)
        })
        .catch((err) => {
          console.log(err);
          res.status(500).send('error searching game')
        })
    } else {
      res.status(400).send('no search given')
    }
  } else {
    res.status(400).send('HTTP method not supported');
  }
}