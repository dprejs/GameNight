import users from "../../../database/models/users";


export default function handler (req, res) {
  if (req.method === 'GET' ) {
    if(req.query.uid) {
      users.userDetails(req.query.uid).then((results) => {
        res.status(200).send(results.rows[0]);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('error getting user details')
      })
    } else {
      res.status(400).send('no user id given')
    }
  } else {
    res.status(400).send('HTTP method not supported');
  }
}