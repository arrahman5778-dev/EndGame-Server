const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const cors = require("cors");

/* ============= start middleware =============== */
app.use(cors());
app.use(express.json());

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://TheEndGame:1MDoEgY6h9qe6ZfR@cluster0.wz4litd.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

/*  ========================  Mongodb Add  ==========================   */
const uri =
  "mongodb+srv://TheEndGame:1MDoEgY6h9qe6ZfR@cluster0.wz4litd.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const collection = client.db("TodoList").collection("addItems");
    /*  ==================  Add   Todo key   ==================*/
    app.post("/addItems", async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await collection.insertOne(data);
      res.send(result);
    });
    /*  ==================  Total Todo get   ==================*/
    app.get("/items", async (req, res) => {
      // http://localhost:5000/items  // data fet
      const data = {};
      const result = await collection.find(data).toArray();
      res.send(result);
    });

    /*  ==================  Todo update    ==================*/
    app.put("/upToDo/:id", async (req, res) => {
      const id = req.params.id;
      const todo = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          data: todo.updateTodo,
        },
      };
      const Todo = await collection.updateOne(filter, updateDoc, options);
      res.send({ success: true, data: Todo });
    });

    /* ============================= Todo Checkbox and complied  =================== */
    app.patch("/Checkbox/:CheckID", async (req, res) => {
      const data = req.params.CheckID;
      const id = { _id: ObjectId(data) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          Checkbox: true,
        },
      };
      const result = await collection.updateOne(id, updateDoc, options);
      res.send(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
