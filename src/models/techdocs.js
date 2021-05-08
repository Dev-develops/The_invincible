const mongoose = require("mongoose");

const docSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Doc", docSchema);
