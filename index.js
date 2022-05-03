const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
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



// Jwt Verify Access
function jwtVerify(req, res, next) {
  const headerAuth = req?.headers?.authorization;
  if (!headerAuth) {
    return res.status(401).send({ message: "Unauthorization Access" })
  }
  const token = headerAuth.split(' ')[1];
  jwt.verify(token, process.env.JSON_TOKEN, (err, decoded) => {
    if (err) {
      return res.status(403).send("Forbidden Access")
    }
    else {
      req.decoded = decoded;
      next()
    }
  })
}

function run() {
  try {
    client.connect()
    const carCollection = client.db("CarUser").collection("stokes");;

    // jwt Token Api
    app.post("/login", async (req, res) => {
      const tokenRecive = req.body;
      const tokenAccess = jwt.sign(tokenRecive, process.env.JSON_TOKEN)
      res.send({ tokenAccess })
    })


    // Load Default Cars
    app.get("/products", async (req, res) => {
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
    app.get("/productAddPerEmail", jwtVerify, async (req, res) => {
      const emailDecoded = req.decoded?.email;
      const email = req.query.email;
      if (email === emailDecoded) {
        const query = { email }
        const cursor = carCollection.find(query);
        const result = await cursor.toArray()
        res.send(result);
      }
      else {
        res.status(403).send({ message: "UnAutherization Access" })
      }
    })

    // Delete Api
    app.delete("/productDelete/:id", async (req, res) => {
      const deleteReq = req.params.id;
      const query = { _id: ObjectId(deleteReq) }
      const result = await carCollection.deleteOne(query);
      res.send(result)
    })

  }
  catch {

  }
}
run()

// App Listen
app.listen(port, () => {
  console.log("Maigo Mai Ja kotin Assiment", port);
})