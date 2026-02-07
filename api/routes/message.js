const router = require('express').Router();
const conversationManager = require('../managers/conversation');
const messageManager = require('../managers/message');
const { authenticate } = require('../middleware/auth');

// router.post('/create', async (req, res) => {
//     try {
//         let conversation = await conversationManager.create(req.body);
//         return res.status(200).send(conversation);
//     } catch (ex) {
//         return res.status(500).send(ex.message);
//     }
// });

// router.get('/all', async (req, res) => {
//     try {
//         const userId = req.tokenData.userId;
//         conversations = await conversationManager.getAll(userId);
//         return res.status(200).send(conversations);
//     } catch (ex) {
//         return res.status(500).send(ex.message);
//     }
// });

router.get('/:conversationId', authenticate, async (req, res) => {
    try {
        const conversationId = req.params.conversationId;
        // Verify user is a member of the conversation
        const conversation = await conversationManager.getById(conversationId);
        if (!conversation) {
            return res.status(404).send('Conversation not found');
        }
        const isMember = conversation.members.some(member => member.toString() === req.userId);
        if (!isMember) {
            return res.status(403).send('Unauthorized: You are not a member of this conversation');
        }
        const t = await messageManager.getByConversationId(conversationId);
        return res.status(200).send(t);
    } catch (ex) {
        return res.status(500).send(ex.message);
    }
});

module.exports = router;