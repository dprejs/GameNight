import games from "../../../../database/models/games";

export const config = {
  api: {
    externalResolver: true,
  },
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    games.ggGamesWithoutImages().then((result) => {
      res.status(200).send(result.rows)
    })
  } else if (req.method === "PUT") {
    console.log("put request")
    const game = req.body;
    // console.log(game);
    games.ggAddBggData(game).then(() => {
      console.log("game added")
      return res.status(200);

    }).catch((err) => {
      console.log("error updating game: ", err)
      return res.status(500);

    });
  }else {
    res.status(400).send('HTTP method not supported');
  }
}