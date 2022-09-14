const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const studentSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String },
  currentClass: { type: Number, required: true },
  division: { type: String, required: true }
})

const StudentModel = mongoose.model("students", studentSchema);

module.exports = StudentModel;