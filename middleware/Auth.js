import jwt from 'jsonwebtoken';
import db from '../db';
import keys from '../config/keys';

const Auth = {

    async verifyToken(req, res, next) {
        const token = req.headers['x-api-key'];
        if (!token) {
            return res.status(400).send({ 'message': 'Token is not provided' });
        }
        try {
            const decoded = await jwt.verify(token, keys.SECRET);
            const text = 'SELECT * FROM users WHERE id = $1';
            const { rows } = await db.query(text, [decoded.userId]);
            if (!rows[0]) {
                return res.status(400).send({ 'message': 'The token you provided is invalid' });
            }
            req.user = { id: decoded.userId };
            next();
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}

export default Auth;