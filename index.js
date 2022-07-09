const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

// userNAme = pabnaBikeCorner
// pass = AaYMG8soOFSGsL5V

const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.DB_PASS}@cluster0.hdkgq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const dataCollection = client.db("pabnaBikeCorner").collection("bikeData");
        
        let email;
        app.get('/bikeData', async (req, res) => {
            email = req?.query?.email;
            console.log(email);
            const query = {};
            const cursor = dataCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/bikeData/:id', async (req, res) => {
            let id = req.params.id;
            // console.log(id)
            const query = { _id: ObjectId(id) };
            const singleData = await dataCollection.findOne(query);
            res.send(singleData);
        })

        //My-Items
        // app.get('/bikeData', async (req, res) => {
            // const email = req.query.email;
            // console.log(email);
            // const query = {};
            // const cursor = dataCollection.find(query);
            // const resultItem = await cursor.toArray();
            // res.send(resultItem);
        // })
         //My-Items
        app.get('/bikeData', async (req, res) => {
            // const email = req.query?.email;
            // console.log(email);
            const query = {};
            const cursor = dataCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })

        //POST API
        app.post("/bikeData", async (req, res) => {
            const postData = req.body;
            const result = await dataCollection.insertOne(postData);
            res.send(result);
        })
        // Update data 
        app.put('/bikeData/:id', async (req, res) => {
            // const idd = parseInt(id)
            const id = req.params.id;
            // console.log(id)
            const updateData = req.body;
            const filter = { _id: ObjectId(id) };
            console.log(filter)
            const options = { upsert: true };
            //name, image, description, price, quentity, suppliername
            const updatedValue = {
                $set: {
                    name: updateData.name,
                    image: updateData.image,
                    description: updateData.description,
                    price: updateData.price,
                    quentity: updateData.quentity,
                    suppliername: updateData.suppliername
                }
            };
            const result = await dataCollection.updateOne(filter, updatedValue, options)
            res.send(result);
        })
    }
    catch {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hellooo Rabbi,,,,,!!!!!!!')
})

app.listen(port, () => {
    console.log(`Example app listening on port === ${port}`)
})