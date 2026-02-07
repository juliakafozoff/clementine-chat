const Conversation = require('../models/conversation');
const Message = require('../models/message');
const mongoose = require("mongoose");

const Manager = {
    create: async t => {
        let alreadyExists = await Conversation.find({
            members: {$all: t.members}
        });

        if (alreadyExists.length > 0)
            return alreadyExists[0];

        let conversation = new Conversation({...t});
        conversation = await conversation.save();
        return conversation ? conversation : false;
    },

    getById: async conversationId => {
        let t = await Conversation.findById(conversationId);
        return t ? t : false;
    },

    getMembersById: async conversationId => {
        let t = await Conversation.findById(conversationId);
        return t ? t.members : false;
    },

    getAll: async userId => {
        let t = await Conversation.aggregate([
            {
                $match: {
                    members: mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: `users`,
                    localField: `members`,
                    foreignField: `_id`,
                    as: `members`
                }
            },
            {
                $lookup: {
                    from: `messages`,
                    localField: `_id`,
                    foreignField: `conversationId`,
                    as: `messages`
                }
            },
        ]).sort({'messages.date': -1});

        t = t.map(x => {
            let recentMessages = x.messages.sort((a, b) => new Date(b.date) - new Date(a.date));
            return {
                _id: x._id,
                joined: x.joined,
                members: x.members,
                subtitle: recentMessages.length > 0 ? recentMessages[0].body : ``,
                recentDate: recentMessages.length > 0 ? recentMessages[0].date : ``,
            };
        }).sort((a, b) => new Date(b.recentDate) - new Date(a.recentDate));

        return t;
    },

    getAdminAll: async (keyword, from, to) => {
        let messages = await Message.aggregate([
            {
                $match: {
                    $and: [
                        {body: {$regex: keyword, $options: 'i'}},
                        // {
                        //     date: {
                        //         $gte: from,
                        //         $lte: to
                        //     }
                        // }
                    ]
                }
            },
            {
                $lookup: {
                    from: `conversations`,
                    localField: `conversationId`,
                    foreignField: `_id`,
                    as: `conversation`
                }
            },
            { $unwind: '$conversation'},
            {
                $lookup: {
                    from: `users`,
                    localField: `conversation.members`,
                    foreignField: `_id`,
                    as: `users`
                }
            }
        ]).sort({date: -1});

        messages = messages.map(x => {
            let sender = x.users.find(k => k._id.toString() === x.authorId.toString());
            let receiver = x.users.find(k => k._id.toString() !== x.authorId.toString());
            return {
                body: x.body,
                date: x.date,
                sender: `${sender.name} (${sender.email})`,
                senderIp: sender.ip || ``,
                receiver: `${receiver.name} (${receiver.email})`,
                receiverIp: receiver.ip || ``
            };
        });

        return messages;
    },

    // getAll: async userId => {
    //     let t = await Conversation.aggregate([
    //         {
    //             $match: {
    //                 members: mongoose.Types.ObjectId(userId)
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: `users`,
    //                 localField: `members`,
    //                 foreignField: `_id`,
    //                 as: `members`
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: `messages`,
    //                 localField: `_id`,
    //                 foreignField: `conversationId`,
    //                 as: `messages`
    //             }
    //         },
    //     ]);
    //     return t;
    // }
};

module.exports = Manager;