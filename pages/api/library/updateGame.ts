import games from "../../../database/models/games";

export default function handler(req, res) {
  if (req.method === 'PUT') {
    // console.log(req.body)
    games.updateGame(req.body)
    .then(() => {
      console.log("success")
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("error")
    })
    res.status(200).send("game updated");
  } else {
    res.status(400).send('HTTP method not supported');
  }
}