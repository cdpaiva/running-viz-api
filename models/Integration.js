const mongoose = require("mongoose");

const IntegrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide an userId"],
    },
    code: {
      type: String,
    },
    token: {
      access_token: String,
      token_type: String,
      expires_in: Number,
      x_user_id: Number,
    },
    profile: {
      "first-name": String,
      "last-name": String,
      height: Number,
      weight: Number,
      birthdate: String,
      gender: String,
      "member-id": String,
      "polar-user-id": String,
      "registration-date": String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Integration", IntegrationSchema);
