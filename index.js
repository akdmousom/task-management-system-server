const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();


app.use(express.json())
app.use(cors({
    origin: ["https://noteer-task-management-system.web.app", "https://noteer-task-management-system.firebaseapp.com"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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


    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.post('/api/v1/add-task', async(req,res)=>{
    const data = req.body;
    const result = await addedTaks.insertOne(data)
    res.send(result)
   
   

})

app.get('/api/v1/all-task', async(req,res)=>{
    const cursor = addedTaks;
    const {email}= req.query
    const query = {email:email}
    const result = await cursor.find(query).toArray();
    res.send(result)
})

app.patch('/api/v1/completed-task/:id', async(req,res)=>{
    const id = req.params.id;
    const cursor = addedTaks;
    const filter = {_id: new ObjectId(id)};
    const options = { upsert: true };
    const updateDoc = {
        $set: {
          taskStatus: 'completed'
        },
      };
    const result = await cursor.updateOne(filter, updateDoc, options);
    res.send(result)

})

app.patch('/api/v1/ongoing-task/:id', async(req,res)=>{
  const id = req.params.id;
  const cursor = addedTaks;
  const filter = {_id: new ObjectId(id)};
  const options = { upsert: true };
  const updateDoc = {
      $set: {
        taskStatus: 'ongoing'
      },
    };
  const result = await cursor.updateOne(filter, updateDoc, options);
  res.send(result)

})

app.delete('/api/v1/delete-task/:id', async(req,res)=>{
  const {id} = req.params;
  const cursor = addedTaks;
  const ids = {_id:new ObjectId(id)}
  const result = await cursor.deleteOne(ids);
  res.send(result)
})

app.get('/api/v1/edit-task/:id', async(req,res)=>{
  const {id} = req.params;
  const cursor = addedTaks;
  const filter = {_id: new ObjectId(id)}
  const result = await cursor.findOne(filter)
  res.send(result)  
})


app.get('/api/v1/all-task', async(req,res)=>{
  const {email, taskStatus}= req.query
  let query;
  
  if (email) {
    
      return console.log('No email here');
      
    } else if (email) {

      query = {email: email}
      
    } else if(taskStatus){
      query = {taskStatus: taskStatus}
    }
    
    else if(email && taskStatus){
      
      query = {email: email, taskStatus: taskStatus}
      
    }
    const cursor = addedTaks;
    // const query = {email:email}
    const result = await cursor.find(query).toArray();

    res.send(result)
    
})





app.get('/helth', async(req,res)=>{
    res.send('Server Is Running')
})

app.listen(port, ()=>{
    console.log(`The server is running on port: ${port}`);
})










