const express = require('express');
const app = express() ;
const cors = require('cors');
const port = process.env.PORT || 5000;


// MiddleWare
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("User Creted")
})


// App Listen
app.listen(port, () => {
    console.log("O mai God ja Hard Assiment",port);
})