import { Client } from 'pg';
const db = new Client({
  database: 'gamenight',
});
console.log('connecting to db')
db.connect((err) => {
  if (err) {
    console.log('connection error', err.stack)
  } else {
    console.log('connected to db')
  }
});

export default db;
