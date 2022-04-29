const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;


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
  try{
    client.connect()
    const carCollection = client.db("carUser").collection("stokes");
  }
  catch{

  }
}
run()



// App Listen
app.listen(port, () => {
  console.log("O mai God ja Hard Assiment", port);
})