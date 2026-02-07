const router = require('express').Router();
const conversationManager = require('../managers/conversation');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
    try {
        // Verify user is part of the conversation members
        if (!req.body.members || !req.body.members.includes(req.userId)) {
            return res.status(403).send('Unauthorized: You must be a member of the conversation');
        }
        let conversation = await conversationManager.create(req.body);
        return res.status(200).send(conversation);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

router.get('/all/:userId', authenticate, async (req, res) => {
    try {
        const userId = req.params.userId;
        // Verify userId matches authenticated user
        if (req.userId !== userId) {
            return res.status(403).send('Unauthorized: Cannot access other user\'s conversations');
        }
        let conversations = await conversationManager.getAll(userId);
        return res.status(200).send(conversations);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;