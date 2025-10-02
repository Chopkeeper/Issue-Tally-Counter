const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
if (!uri) {
    throw new Error('MONGODB_URI is not defined in the .env file');
}

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectDB() {
    if (db) return db;
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB Atlas");
        db = client.db(); // Use the default database specified in the connection string
        return db;
    } catch (err) {
        console.error("Could not connect to MongoDB Atlas", err);
        process.exit(1);
    }
}

module.exports = connectDB;