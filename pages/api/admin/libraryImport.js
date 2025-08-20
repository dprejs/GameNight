const fs = require("fs");
const { parse } = require("csv");
const { Client } = require("pg");

const db = new Client({
  host: "localhost",
  user: "ggcafe",
  password: "meeple",
  database: "ggcafe",
})
console.log("connecting to db")
db.connect((err) => {
  if (err) {
    console.log("connection error: ", err.stack)
  } else {
    console.log("connected to db")
  }
})

const ggAddGame = (game) => {
  return db.query('INSERT INTO games(name, description, min_players, max_players, min_playtime, max_playtime, min_age, category, difficulty, bgg_rating, game_type, best_player_count, is_classic, is_coop, is_party, is_expansion, notes) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) ON CONFLICT DO NOTHING', [game.title, game.description, game.minPlayers, game.maxPlayers, game.duration, game.maxDuration, game.minPlayerAge, game.category, game.difficulty, game.bggRating, `{${game.gameType.join(", ")}}`, game.bestPlayers, game.isClassic, game.isCoop, game.isParty, game.isExpansion, game.notes])
};

// const fileImport = () => {
//   let i = 0;
//   // fs.createReadStream(require.resolve("./library.txt"))
//     .pipe(parse({ delimiter: ",", from_line: 2 }))
//     .on("data", function (row) {
//       const game = {
//         title: row[0],
//         order: row[1],
//         category: row[2],
//         minPlayers: row[3],
//         maxPlayers: row[4],
//         bestPlayers: row[5],
//         difficulty: row[6],
//         duration: row[7],
//         maxDuration: row[8],
//         minPlayerAge: row[9],
//         bggRating: row[10],
//         gameType: row[11],
//         isClassic: row[12],
//         isCoop: row[13],
//         isParty: row[14],
//         isExpansion: row[15],
//         description: row[16],
//         notes: row[17],
//       }
//       if (game.minPlayers === '') {
//         game.minPlayers = null;
//       }
//       if (game.maxPlayers === '') {
//         game.maxPlayers = null;
//       }
//       if (game.bestPlayers === '') {
//         game.bestPlayers = null;
//       }
//       if (game.duration === '') {
//         game.duration = null;
//       }
//       if (game.maxDuration === '') {
//         game.maxDuration = null;
//       }
//       if (game.minPlayerAge === '') {
//         game.minPlayerAge = null;
//       }
//       if (game.bggRating === '') {
//         game.bggRating = null;
//       }
//       if (game.best_player_count === '') {
//         game.best_player_count = null;
//       }
//       if (game.difficulty === '') {
//         game.difficulty = null;
//       }
//       if (game.gameType === '') {
//         game.gameType = [];
//       } else {
//         game.gameType = game.gameType.split(',')
//       }
//       ggAddGame(game);
//       if (i < 5) {
//         console.log(game)
//       }
//       i++;
//     })
// }

fileImport();