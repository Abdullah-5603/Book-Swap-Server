const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 3000;  

// middlewares
app.use(express.json())
app.use(cors())
// app.use(cors({
//     origin : 'http://localhost:5173',
//     credentials : true
// }))


// mongodb uri
const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.jjaqgwq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// dbConnect function for connecting to the database
const dbConnect = async () => {
    try {
        await client.db("admin").command({ ping: 1 })
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log(error.message)
    }
}
dbConnect()

// all collections are here
const allBooksCollection = client.db('BookSwap').collection('allBooks')

// api logics
// get all books api
app.get('/all-books', async (req, res) => {
    const result = await allBooksCollection.find().toArray()
    res.send(result)
})

// get a specific book
app.get('/book/:id', async (req, res) => {
    const id = req.params.id
    const query = {id : new ObjectId(id)}
    const result = await allBooksCollection.findOne(query)
    res.send(result)
})

// get books by search 
app.get('/search-books/:text', async (req, res) => {
    try {
        const text = req.params.text;
        const result = await allBooksCollection.find({
          $or : [
            {title : {$regex : text, $options: "i"}}
          ]
        }).toArray();
        res.send(result)        
      } catch (error) {
        req.send(error.message)
      }
})

app.get("/", async (req, res) => {
    res.send('Book Swap is running')
})

app.listen(port, (req, res) => {
    console.log(`listening on port ${port}`)
})