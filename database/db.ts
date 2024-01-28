import { Client } from 'pg';
const db = new Client({
  host:  process.env.PG_HOST,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
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
