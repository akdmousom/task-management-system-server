const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();


app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.chkrm7d.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const database = client.db('task-management-system');
const addedTaks = database.collection('all-task');

async function run() {
  try {


    app.post('/api/v1/add-task', async(req,res)=>{
        const data = req.body;
        const result = await addedTaks.insertOne(data)
        
        res.send(result)
       

    })

    app.get('/api/v1/all-task', async(req,res)=>{
        const cursor = addedTaks;
        const result = await cursor.find().toArray();
        res.send(result)
    })




    app.get('/helth', async(req,res)=>{
        res.send('Server Is Running')
    })
    
    app.listen(port, ()=>{
        console.log(`The server is running on port: ${port}`);
    })





    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









