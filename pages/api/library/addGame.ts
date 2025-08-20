import games from '../../../database/models/games';

const { addGame } = games;
export default function handler(req, res) {
  if (req.method === 'POST') {
      const game = req.body;
      console.log(game)
      addGame(game)
      .then((result) => {
        console.log("sucess")
        console.log(result)
        res.status(200).send(result.rows[0])
      })
      .catch((err) => {
        console.log(err)
        res.status(500).send("error saving game")
      })
  } else {
    res.status(400).send('HTTP method not supported');
  }
}