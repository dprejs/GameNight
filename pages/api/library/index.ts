import libraries from "../../../database/models/libraries";


const { getUserLibrary } = libraries;
export default function handler(req, res) {
  console.log('get library')
  if (req.method === 'GET') {
    if(req.query.uid) {
      const { uid, sortBy, order } = req.query;
      getUserLibrary(uid, sortBy || 'name', order || 'ASC')
      .then((result) => {
        res.status(200).send(result.rows);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('error adding game')
      })
    } else {
      res.status(400).send('no user id given')
    }
  } else {
    res.status(400).send('HTTP method not supported');
  }
}