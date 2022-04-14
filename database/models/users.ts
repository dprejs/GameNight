import db from '../db';
interface user {
  uid: string;
  username: string;
  [prop: string]: any;
}

const users = {
  addUser: ({uid, username}: user): Promise<any> => {
    return db.query('INSERT INTO users(uid, username) VALUES($1, $2) ON CONFLICT DO NOTHING', [uid, username])
  },
  getUser: (uid: string): Promise<any> => {
    return db.query('SELECT * FROM users WHERE uid = $1', [uid])
  },
};

export default users;