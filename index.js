const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Home
app.get("/", (req, res) => {
  res.send("Hii");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@conceptualdatabase.fo2palu.mongodb.net/?retryWrites=true&w=majority&appName=ConceptualDatabase`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function Main() {
  try {
    const gymScheduleCollection = client
      .db("gym-schedule")
      .collection("gymScheduleData");

    // const userCollection = client.db("gym-schedule").collection("users");

    // POST a schedule
    app.post("/schedules", async (req, res) => {
      const scheduleData = req.body;
      const result = await gymScheduleCollection.insertOne(scheduleData);
      res.send(result);
    });

    // Get allSchedule
    app.get("/schedules", async (req, res) => {
      const { searchParams } = req.query;
      let query = {};
      if (searchParams) {
        query = { title: { $regex: searchParams, $options: "i" } };
      }
      const cursor = await gymScheduleCollection.find(query).toArray();
      res.send(cursor);
    });

    // Get a Single Schedule
    app.get("/schedules/:id", async (req, res) => {
      const result = await gymScheduleCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    // Delete a Schedule
    app.delete("/schedule/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await gymScheduleCollection.deleteOne(query);
      res.send(result);
    });

    // Update Schedule
    app.patch("/schedule/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const schedule = req.body;
      console.log(schedule);
      const updateSchedule = {
        $set: {
          title: schedule?.title,
          day: schedule?.day,
          date: schedule?.date,
          hour: schedule?.hour,
        },
      };

      const result = await gymScheduleCollection.updateOne(
        query,
        updateSchedule
      );
      res.send(result);
    });

    // Update Complete State
    app.patch("/completeStatus/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const updateSchedule = {
        $set: {
          isCompleted: true,
        },
      };

      const result = await gymScheduleCollection.updateOne(
        query,
        updateSchedule
      );
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
Main().catch(console.dir);

// Server Port
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`);
});
