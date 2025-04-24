import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    friends: [
        {
            friendId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            username: { type: String, required: true },
        }
    ],
}, { timestamps: true });

const Friend = mongoose.model('Friend', friendSchema);

export default Friend;
