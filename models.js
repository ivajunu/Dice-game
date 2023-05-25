const mongoose = require("mongoose");

const Dicegame = new mongoose.Schema({
  user: {
    type: String,
  },
  throwdice: {
    type: Number,
    required: true,
  },
  sum: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("diceG", Dicegame);
