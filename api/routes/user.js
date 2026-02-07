const router = require('express').Router();
const userManager = require('../managers/user');
const crypto = require('../utils/crypto');
const jwt = require('../utils/jwt');

router.post('/signup', async (req, res) => {
    try {
        let user = await userManager.getByEmail(req.body.email);
        if (user)
            return res.status(400).send(`User already exists with this email.`);

        const obj = {
            ...req.body,
            password: await crypto.hash(req.body.password)
        };

        user = await userManager.create(obj);
        
        // Generate tokens for new user
        const { accessToken, refreshToken } = jwt.generateTokens(user);
        
        return res.status(200).send({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await userManager.getByEmail(req.body.email);
        if (!user)
            return res.status(400).send(`User does not exists with this email.`);

        const passwordMatches = await crypto.compare(req.body.password, user.password);
        if (!passwordMatches)
            return res.status(400).send(`Password did not match.`);

        // Generate tokens
        const { accessToken, refreshToken } = jwt.generateTokens(user);
        
        return res.status(200).send({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken
        });
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post(`/all`, async (req, res) => {
    try {
        const keyword = req.body.keyword || ``;
        const users = await userManager.getAll(keyword);
        return res.status(200).send(users);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(400).send('Refresh token is required');
        }
        
        const decoded = jwt.verifyToken(refreshToken);
        
        if (!decoded) {
            return res.status(401).send('Invalid or expired refresh token');
        }
        
        const user = await userManager.getById(decoded.userId);
        if (!user) {
            return res.status(401).send('User not found');
        }
        
        const { accessToken } = jwt.generateTokens(user);
        return res.status(200).send({ accessToken });
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;