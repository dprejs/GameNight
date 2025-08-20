import db from '../db';
import game from '../../interfaces/game';

const games = {
  //add game to data base
  addGame: (game: game): Promise<any> => {
    return db.query('INSERT INTO games(name, description, min_players, max_players, min_playtime, max_playtime, min_age, image_url, category, difficulty, bgg_rating, game_type, best_player_count, is_classic, is_coop, is_party, is_expansion, bgg_id, bgg_description) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *', [ game.name, game.description, game.min_players, game.max_players, game.min_playtime, game.max_playtime, game.min_age, game.image_url, game.category, game.difficulty, game.bgg_rating, game.game_type, game.best_player_count, game.is_classic, game.is_coop, game.is_party, game.is_expansion, game.bgg_id, game.bgg_description]);
  },
  //search game name and dexcription from lexeme column and return matches
  searchGames: (text: string): Promise<any> => {
    return db.query(`SELECT id, name, description, min_players, min_players, max_players, min_playtime, max_playtime, min_age, thumb_url, image_url, rules_url, official_url, year_published FROM games WHERE document @@ to_tsquery($1)`, [`${text.replace(/ /g, ' & ')}:*`])
  },
  // retrieve all games without img_url set
  ggGamesWithoutImages: (): Promise<any> => {
    return db.query("SELECT * FROM games WHERE games.image_url IS NULL ORDER BY games.name ASC")
  },
  // add missing data from bgg
  ggAddBggData: (game): Promise<any> => {
    return db.query(`UPDATE games SET image_url = $1, bgg_id = $2, year_published = $3, bgg_description = $4 WHERE id = ${game.id}`, [game.image, game.bggId, game.yearPublished, game.description])
  },
  updateGame: (game) => {
    return db.query(`UPDATE games SET name=$1, description=$2, min_players=$3, max_players=$4, min_playtime=$5, max_playtime=$6, min_age=$7, image_url=$8, category=$9, difficulty=$10, bgg_rating=$11, game_type=$12, best_player_count=$13, is_classic=$14, is_coop=$15, is_party=$16, is_expansion=$17, bgg_id=$18, bgg_description=$19 WHERE id=${game.id}`, [game.name, game.description, game.min_players, game.max_players, game.min_playtime, game.max_playtime, game.min_age, game.image_url, game.category, game.difficulty, game.bgg_rating, game.game_type, game.best_player_count, game.is_classic, game.is_coop, game.is_party, game.is_expansion, game.bgg_id, game.bgg_description])
  },
  deleteGame: (id) => {
    return db.query(`DELETE FROM games WHERE id=$1` , [id])
  }
}

export default games;
