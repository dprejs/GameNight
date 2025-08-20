import libraries from "../../../database/models/libraries";

export const config = {
  api: {
    externalResolver: true,
  },
}

const { getggCafeLibrary } = libraries;
export default function handler(req, res) {
  if (req.method === 'GET') {
    const { sortBy, order } = req.query;
    getggCafeLibrary(sortBy || 'name', order || 'ASC')
      .then((result) => {
        res.status(200).send(result.rows);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('error retrieving library')
      })
  } else {
    res.status(400).send('HTTP method not supported');
  }
}