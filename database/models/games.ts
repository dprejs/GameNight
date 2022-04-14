import db from '../db';
import game from '../../interfaces/game';

const games = {
  //add game to data base
  addGame: (game:game): Promise<any> => {
    return db.query('INSERT INTO games(id, name, description, min_players, max_players, min_playtime, max_playtime, min_age, thumb_url, image_url, rules_url, official_url, year_published) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT DO NOTHING', [game.id, game.name, game.description, game.min_players, game.max_players, game.min_playtime, game.max_playtime, game.min_age, game.thumb_url, game.image_url, game.rules_url, game.official_url, game.year_published]);
  },
  //search game name and dexcription from lexeme column and return matches
  searchGames: (text: string): Promise<any> => {
    return db.query(`SELECT id, name, description, min_players, min_players, max_players, min_playtime, max_playtime, min_age, thumb_url, image_url, rules_url, official_url, year_published FROM games WHERE document @@ to_tsquery($1)`, [`${text.replace(/ /g, ' & ')}:*`])
  }
}

export default games;
