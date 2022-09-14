const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const mongoose = require("mongoose");
const StudentModel = require("./models/students");
const idModel = require("./models/id");
const initialData = require("./InitialData");
app.use(express.urlencoded());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
mongoose.connect("mongodb://localhost/StudentDB");


// your code goes here

const createInititialData = async () => {
  try {
    const data = await StudentModel.create(initialData);
    const id = await idModel.create({ id: 8 });

    console.log("initial data loaded");
  } catch {
    console.log("initial data already loaded");
  }
}

createInititialData();

app.get("/api/student", async (req, res) => {
  const allStudents = await StudentModel.find();
  res.status(200).json({
    allStudents
  })
});

app.get("/api/student/:id", async (req, res) => {

  try {
    const Student = await StudentModel.findOne({ id: req.params.id });
    if (Student === null) {
      return res.status(404).json({
        response: "id is not valid"
      })
    }
    res.status(200).json({
      Student
    })
  } catch {
    res.status(404).json({
      response: "id is not valid"
    })
  }
});

app.post("/api/student", async (req, res) => {
  try {
    if (req.body.id != undefined || req.body.name === undefined || req.body.currentClass === undefined || req.body.division === undefined) {
      return res.status(400).json({
        response: "incomplete or invalid details"
      })
    }
    else {
      const newId = await idModel.findOne({ _id: "630f0beb16c964053d4b5170" })
      const updatedId = await Number(newId.id) + 1;

      const newUser = await StudentModel.create({ id: updatedId, name: req.body.name, currentClass: Number(req.body.currentClass), division: req.body.division });

      const updateIdInDb = await idModel.updateOne({ _id: "630f0beb16c964053d4b5170" }, { id: updatedId });

      res.json({
        id: updatedId
      })

    }
  } catch {
    res.status(400).json({
      response: "incomplete or invalid details db hit"
    })
  }

});

app.put("/api/student/:id", async (req, res) => {
  try {
    const Student = await StudentModel.findOne({ id: req.params.id });
    if (Student === null) {
      return res.status(400).json({
        response: "id is not valid"
      })
    } else if (req.body.id != null) {
      return res.status(400).json({
        response: "id can not be updated invalid opreations"
      })
    }
    else {
      const update = await StudentModel.updateOne({ id: req.params.id }, req.body);
      res.status(200).json({
        response: "Details Updated Sucessfully"
      })
    }
  } catch {
    res.status(400).json({
      response: "id is not valid"
    })
  }

});

app.delete("/api/student/:id", async (req, res) => {
  try {
    const Student = await StudentModel.deleteOne({ id: req.params.id });
    if (Student.deletedCount === 0) {
      return res.status(404).json({
        response: "id is not valid"
      })
    }
    res.status(200).json({
      response: "Deleted Sucessfully"
    })
  } catch {
    res.status(404).json({
      response: "id is not valid"
    })
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   