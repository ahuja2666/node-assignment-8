const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const idSchema = new Schema({
  id: { type: Number, required: true },
});

const idModel = mongoose.model("id", idSchema);

module.exports = idModel;