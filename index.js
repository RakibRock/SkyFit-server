const { MongoClient } = require("mongodb");
const express = require("express");
var cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ald9d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("connected successfully");
    const database = client.db("SkyFit");
    const productsCollection = database.collection("productsCollection");
    const ordersCollection = database.collection("ordersCollection");
    const reviewsCollection = database.collection("reviewsCollection");
    const sixProductsCollection = database.collection("sixProductsCollection");

    //GET API- WE WANT TO GET THE DATA FROM THE DATABASE (products)
    //Home
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //Explore
    app.get("/allProducts", async (req, res) => {
      const query = {};
      const cursor = productsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //GET request to get the data of a single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      console.log("product with id", id);
      res.send(product);
    });
    //POST for myorders
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      console.log(result);
      res.json(result);
    });

    //   const user =
    //   console.log(req.params.id);
    // });

    //GET individual product
    // app.get("/products/:id", async (req, res) => {
    //   const cursor = productsCollection.findOne({});
    //   const result = await cursor.toArray();
    //   res.send(result);
    //   console.log(result);
    // });

    //POST order details
    // app.post("/orders", async (req, res) => {
    //   const order = req.body;
    //   const result = await ordersCollection.insertOne(order);
    //   console.log(result);
    //   res.json(result);
    // });

    //GET to show the appointments booked by user
    // app.get("/appointment", async (req, res) => {
    //   const email = req.query.email;
    //   const date = new Date(req.query.date).toLocaleDateString();
    //   console.log(date);
    //   console.log(email);
    //   const query = { email: email, date: date };
    //   const cursor = appointments.find(query);
    //   const result = await cursor.toArray();
    //   res.json(result);
    // });
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log("running at port", port);
});
