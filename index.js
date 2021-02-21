const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri =
  "mongodb+srv://chris:delorean@cluster0.joafk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('delorean');
    const collection = database.collection('Company');
    // Query for a movie that has the title 'Back to the Future'
    const query = { make: 'Tesla' };
    const car = await collection.findOne(query);
    console.log(car);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);