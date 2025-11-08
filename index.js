const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// MiddleWare
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://smartdbUser:Yo7Gxk2kFetGZWbc@cluster0.ljdyez8.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res)=>{
    res.send('Smart server is running')
})

async function run() {
  try {
    await client.connect();

    const database = client.db("smart_user");
    const smartCollections = database.collection("smartCollections");

    // GET || Read
    app.get('/users', async(req,res)=>{
        const cursor = smartCollections.find({});
        const result = await cursor.toArray();
        res.send(result);
    })

    // Get specific

    app.get('/users:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await smartCollections.findOne(query);

        res.send(result);
    })

    // POST || Create
    app.post('/users', async(req,res)=>{
        const newProduct = req.body;

        const result = await smartCollections.insertOne(newProduct);

        res.send(result);
    })

    // DELETE
    
    app.delete('users/:id', async(req,res)=>{
        const id = req.params.id;

        const query = {_id: new ObjectId(id)};
        const result = await smartCollections.deleteOne(query);
        res.send(result)
    }) 

    //UPDATE
    app.patch('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const updatedUser = req.body; 
        const query = {_id: new ObjectId(id)};
        const update = {
        $set:{updatedUser}
        }
        const result= await smartCollections.updateOne(query, update);
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally { 
    
  }
}
run().catch(console.dir);

app.listen(port, ()=>{
    console.log(`Smart server is running on port: ${port}`)
})
