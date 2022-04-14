import users from "../../../database/models/users";

const {addUser, getUser} = users;
export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    if(data.uid, data.displayName) {
      const user = {
        ...data,
        username: data.displayName,
      };
      addUser(user)
      .then(() => {
        res.status(200).send('done');
      })
      .catch((err) => {
        console.log('error adding user', err)
        res.status(500).send('error adding user');
      })
    } else {
      res.status(400).sent('need uid and username')
    }
  } else {
    res.status(400).send('HTTP method not supported');
  }
}
