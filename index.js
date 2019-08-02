const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

import '@babel/polyfill';
import User from './controllers/User';
import Auth from './middleware/Auth';


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    return res.status(200).send({ 'message': 'Hello World' });
});


app.post('/user/signup', User.signUp);
app.post('/user/signin', User.signIn);
app.get('/user/profile', Auth.verifyToken, User.getUserDetails);
app.post('/user/profile/update', Auth.verifyToken, User.updateUserDetails);


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});