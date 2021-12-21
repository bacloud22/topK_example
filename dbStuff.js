const { MongoClient } = require("mongodb");
// Connection URI
const uri =
    "mongodb://localhost:27017";
// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        const db = client.db('listings_db_dev')
        const collection = db.collection('listing')
        const list = await collection.find({}).limit(2).toArray()
        console.log(list)


        const pipeline = [
            { $match: { section: "blogs" } },
            { $group: { _id: "$div", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ];
        const aggCursor = collection.aggregate(pipeline);
        for await (const doc of aggCursor) {
            console.log(doc);
        }
        console.log("==========================================");
        const pipeline2 = [
            { $unwind: "$tags" },
            // by section
            { $group: { "_id": { tags: "$tags", section: "$section" }, "count": { "$sum": 1 } } },
            // { $group: { "_id": "$tags", "count": { "$sum": 1 } } },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]
        const aggCursor2 = collection.aggregate(pipeline2);
        for await (const doc of aggCursor2) {
            console.log(doc);
        }
        console.log("==========================================");

        console.log("Connected successfully to server");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);