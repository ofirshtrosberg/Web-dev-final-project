const mongoose = require("mongoose");

const Account = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  profilePictureUrl: {
    type: String,
  },
  email: {
    type: String
  },
  firstName: {
    type: String
  },
  dateOfBirth: {
    type: String
  },
  gender: {
    type: String
  }
});

module.exports = mongoose.model("Account", Account);

