const mongodb = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const DBHOST = process.env.DBHOST;
const DBNAME = process.env.DBNAME;

let collection = undefined;

async function connectToDB() {
  const client = new mongodb.MongoClient(DBHOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  const db = client.db(DBNAME);
  let q_collection = db.collection("quotations");
  return q_collection;
}

async function selectAQuotation() {
  if (!collection) {
    collection = await connectToDB();
  }
  const result = await collection
    .aggregate([{ $sample: { size: 1 } }])
    .toArray();
  return result[0];
}

module.exports = { selectAQuotation };
