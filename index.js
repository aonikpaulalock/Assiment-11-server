const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const ObjectId = require("mongodb").ObjectId;

// MiddleWare
app.use(cors())
app.use(express.json())
require('dotenv').config()

app.get("/", (req, res) => {
  res.send("User Creted")
})


const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.orcjh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
function run() {
  try {
    client.connect()
    const carCollection = client.db("CarUser").collection("stokes");
    const myAddCollection = client.db("MyItems").collection("items");

    // Load Default Cars
    app.get("/products", async (req, res) => {
      // const email = req.query.email;
      // const query = { email }
      const query = {};
      const cursor = carCollection.find(query);
      const result = await cursor.toArray()
      res.send(result);
    })

    // Spacipic id Load Data
    app.get("/product/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: ObjectId(id) }
      const products = await carCollection.findOne(quary);
      res.send(products)
    })

    // Update Delevary incresse and decrease Data
    app.put("/product/:id", async (req, res) => {
      const reqRecive = req.body;
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          quantity: reqRecive.quantity,
        },
      };
      const result = await carCollection.updateOne(query, updateDoc, options);
      res.send(result)
    })


    // Add Data Post Api
    app.post("/productAdd", async (req, res) => {
      const reqPost = req.body;
      console.log(reqPost);
      const result = await carCollection.insertOne(reqPost);
      res.send(result)
    })

    app.get("/productAddPerEmail", async (req, res) => {
        const email = req.query.email ;
        const query = { email }
        const cursor = carCollection.find(query);
        const result = await cursor.toArray()
        res.send(result);
    })

    // Delete Api
    app.delete("/productDelete/:id", async (req, res) => {
      const deleteReq = req.params.id;
      const query = { _id: ObjectId(deleteReq) }
      const result = await carCollection.deleteOne(query);
      res.send(result)
    })


    // // My Items Api
    // app.post("/myItem", async (req, res) => {
    //   const myItems = req.body;
    //   const result = await myAddCollection.insertOne(myItems);
    //   res.send(result)
    // })


    // // My Items Get Api
    // app.get("/myItems", async (req, res) => {
    //   const email = req.query.email ;
    //   const query = {email}
    //   const cursor = myAddCollection.find(query)
    //   const result = await cursor.toArray()
    //   res.send(result)
    // })


  }
  catch {

  }
}
run()



// App Listen
app.listen(port, () => {
  console.log("O mai God ja Hard Assiment", port);
})