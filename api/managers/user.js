const User = require('../models/user');

const Manager = {
    getAll: async keyword => {
        const users = await User.find({
            $or: [
                {name: {$regex: keyword, $options: 'i'}},
                {email: {$regex: keyword, $options: 'i'}}
            ]
        });
        return users;
    },
    getById: async id => {
        const t = await User.findById(id);
        return t ? t : false;
    },
    getByEmail: async email => {
        const t = await User.findOne({email: email});
        return t ? t : false;
    },
    create: async t => {
        let user = new User({...t});
        user = await user.save();
        return user ? user : false;
    },
    delete: async id => {
        let t = await User.findByIdAndDelete(id);
        return t ? true : false;
    }
};

module.exports = Manager;