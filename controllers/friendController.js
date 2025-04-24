import Friend from "../models/Friends.js";

// Fetch the logged-in user's friends list
export const getFriendsList = async (req, res) => {
    const { userId } = req.user;
    try {
        const friendsList = await Friend.findOne({ userId })
            .populate('friends.friendId', 'username profileImage')
            .select('friends');
        if (!friendsList) {
            return res.status(404).json({ message: 'No friends found' });
        }
        res.status(200).json({
            success:true,
            friendsList: friendsList.friends,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching friends list' });
    }
};

// Invite a friend to a match
export const inviteFriend = async (req, res) => {
    const { userId, friendId } = req.body;
    try {
        // Emit socket.io event to invite friend (implement in real-time service)
        res.status(200).json({ message: 'Friend invited to match' });
    } catch (error) {
        res.status(500).json({ message: 'Error inviting friend' });
    }
};
