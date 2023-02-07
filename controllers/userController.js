const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .select('-__v')
      .then((users) => {
        const userObj = {
          users
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ id: req.params.userId })
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },

  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { id: req.params.userId },
      { $set: req.body },
      {
        runValidators: true,
        new: true
      }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },


  // Delete a user and remove them from the thought
  deleteUser(req, res) {
    User.findOneAndRemove({ id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Thought.findOneAndRemove(
            { userId: req.params.userId },
          )
      )
      .then((thought) =>
        !thought
          ? res.status(404).json({
            message: 'User deleted, but no thoughts found',
          })
          : res.json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an friend to a user
  addFriend(req, res) {
    const userAddFriend = User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
    );
    const friendAddUser = User.findOneAndUpdate(
      { _id: req.params.friendId },
      { $addToSet: { friends: req.params.userId } },
    );
    Promise
      .all([userAddFriend, friendAddUser])
      .then(() => res.json({ message: 'Friend added' }))
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      }
      );
  },
  // Remove friend from a user
  removeFriend(req, res) {
    const userRemoveFriend = User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
    );
    const friendRemoveUser = User.findOneAndUpdate(
      { _id: req.params.friendId },
      { $pull: { friends: req.params.userId } },
    );
    Promise
      .all([userRemoveFriend, friendRemoveUser])
      .then(() => res.json({ message: 'Friend removed' }))
      .catch((err) => {
        console.log(err)
        res.status(500).json(err)
      }
      );
  },
};
