const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;



const app = express()


// middle ware
app.use(cors());
app.use(express.json())

// mongo db use

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ocnwsx.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);
// create run func
async function run() {


    try {
        const productCollection = client.db('shopeasydb').collection("products");
        const orderCollection = client.db('shopeasydb').collection("orders");


        // post product details
        app.post('/getallproducts', (async (req, res) => {

            const productsDetails = req.body;
            console.log(productsDetails);
            const result = await productCollection.insertOne(productsDetails);
            console.log(result);
            res.send(result);
        }))
        // all products
        app.get('/getallproducts', async (req, res) => {

            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            console.log(page, size);
            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({ products, count })
        })
        // delete product id
        app.delete('/getallproducts/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.deleteOne(query)
            res.send(result);
        })

        // get orders and post orders
        app.post('/orders', (async (req, res) => {

            const order = req.body;
            console.log(order);
            const result = await orderCollection.insertOne(order);
            console.log(result);
            res.send(result);
        }))

        app.get('/orders', async (req, res) => {
            const query = {}
            const cursor = orderCollection.find(query)
            const orders = await cursor.toArray()
            res.send(orders)
        })


    }
    finally {

    }
}
run()

app.get('/', (req, res) => {
    res.send("Hello easy shop is running")
})


app.listen(port, () => {
    console.log(`Easy Shop is running on port ${port}`);
})