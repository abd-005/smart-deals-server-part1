const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://smartdbUser:Yo7Gxk2kFetGZWbc@cluster0.ljdyez8.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Smart server is running");
});

async function run() {
  try {
    await client.connect();

    const database = client.db("smart_user");
    const smartCollections = database.collection("smartCollections");
    const BidCollections = database.collection("bids");
    const usersCollection = database.collection("users");

    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const email = req.body.email;
      const query = { email: email };
      const existingUser = await usersCollection.findOne(query);

      if(existingUser){
        res.send({message: 'user already exits. do not need to insert again'})
      }
      else{
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
      }
    });

    // GET || Read
    app.get("/products", async (req, res) => {
      // const projectFields = {title:1, price_min:1 , price_max: 1, image:1}
      // const cursor = smartCollections.find().sort({price_min: 1}).limit(3).skip(5).project(projectFields);
      const email = req.query.email;
      console.log(req.query);
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = smartCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get specific

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await smartCollections.findOne(query);

      res.send(result);
    });

    // POST || Create
    app.post("/products", async (req, res) => {
      const newProduct = req.body;

      const result = await smartCollections.insertOne(newProduct);

      res.send(result);
    });

    // DELETE

    app.delete("products/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await smartCollections.deleteOne(query);
      res.send(result);
    });

    //UPDATE
    app.patch("/products/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: { updatedUser },
      };
      const result = await smartCollections.updateOne(query, update);
    });

    ///////////////////////////////////////////////

    // BID related code

    // get

    app.get("/bids", async (req, res) => {
      const email = req.query.email;
      console.log(req.query);
      const query = {};
      if (email) {
        query.buyer_email = email;
      }
      const cursor = BidCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // Get specific

    app.get("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await BidCollections.findOne(query);

      res.send(result);
    });

    // POST || Create
    app.post("/bids", async (req, res) => {
      const newProduct = req.body;

      const result = await BidCollections.insertOne(newProduct);

      res.send(result);
    });

    // DELETE

    app.delete("bids/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await BidCollections.deleteOne(query);
      res.send(result);
    });

    //UPDATE
    app.patch("/bids/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: { updatedUser },
      };
      const result = await BidCollections.updateOne(query, update);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Smart server is running on port: ${port}`);
});
