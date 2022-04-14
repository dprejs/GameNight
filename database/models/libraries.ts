import db from '../db';
import game from '../../interfaces/game';

const libraries = {
  //returns relation id if user has game in library
  getLibraryRelation: (gameId:string, uid:string): Promise<any> => {
    return db.query('SELECT relation_id FROM libraries WHERE uid=$1 AND game_id=$2', [uid, gameId])
  },
  //add game to user library
  addLibraryRelation: (gameId: string, uid: string): Promise<any> => {
    return db.query('INSERT INTO libraries(uid, game_id) VALUES($1, $2)', [uid, gameId])
  },
  //remove game from user library
  removeLibraryRelation: (gameId:string, uid:string): Promise<any> => {
    return db.query('DELETE FROM libraries WHERE game_id=$1 AND uid=$2', [gameId, uid])
  },
  //gets all games in user library
  getUserLibrary: (uid: string): Promise<any> => {
    return db.query('SELECT * FROM games INNER JOIN libraries ON games.id = libraries.game_id WHERE uid=$1 ORDER BY games.name ASC', [uid])
  }
};

export default libraries;