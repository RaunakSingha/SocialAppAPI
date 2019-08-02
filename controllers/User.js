import uuidv4 from 'uuid/v4';
import db from '../db';
import Utility from './Utility';

const User = {

    async signUp(req, res) {
        if (!req.body.email || !req.body.password || !req.body.name) {
            return res.status(400).send({ 'message': 'Some values are missing' });
        }
        if (!Utility.isValidEmail(req.body.email)) {
            return res.status(400).send({ 'message': 'Please enter a valid email address' });
        }
        const hashPassword = Utility.hashPassword(req.body.password);

        const q = `INSERT INTO users(id, name, email, password) 
        VALUES($1, $2, $3, $4) returning *`;

        const values = [
            uuidv4(),
            req.body.name,
            req.body.email,
            hashPassword,
        ];

        try {
            const { rows } = await db.query(q, values);
            return res.status(201).send({ 'message': "User registered successfully" });
        } catch (error) {
            if (error.routine === '_bt_check_unique') {
                return res.status(400).send({ 'message': 'User with that EMAIL already exists' })
            }
            return res.status(400).send(error);
        }
    },

    async signIn(req, res) {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ 'message': 'Some values are missing' });
        }
        if (!Utility.isValidEmail(req.body.email)) {
            return res.status(400).send({ 'message': 'Please enter a valid email address' });
        }
        const q = 'SELECT * FROM users WHERE email = $1';
        try {
            const { rows } = await db.query(q, [req.body.email]);
            if (!rows[0]) {
                return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
            }
            if (!Utility.comparePassword(rows[0].password, req.body.password)) {
                return res.status(400).send({ 'message': 'The credentials you provided is incorrect' });
            }
            const token = Utility.generateToken(rows[0].id);
            return res.status(200).send({ token });
        } catch (error) {
            console.log(error);
            return res.status(400).send(error)
        }
    },

    async getUserDetails(req, res) {
        const text = 'SELECT name, email FROM users WHERE name = $1';
        try {
            const { rows } = await db.query(text,
                [
                    req.query.name
                ]
            );
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'User not found' });
            }
            return res.status(200).send(rows[0]);
        } catch (error) {
            return res.status(400).send(error)
        }

    },

    async updateUserDetails(req, res) {
        const text = 'UPDATE users SET name = $1 WHERE email = $2 returning name, email';
        try {
            //const retreived_password = Utility.hashPassword(req.body.password);
            const { rows } = await db.query(text,
                [
                    req.body.name,
                    req.body.email
                ]
            );
            if (!rows[0]) {
                return res.status(404).send({ 'message': 'User not found' });
            }
            return res.status(200).send(rows);
        } catch (error) {
            console.log(error);
            return res.status(400).send(error)
        }

    }
}

export default User;