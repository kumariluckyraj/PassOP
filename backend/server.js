const dotenv = require("dotenv");
dotenv.config(); // Load .env file

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(MONGO_URI);

const dbName = "passop";
const app = express();

// Use the port provided by the hosting platform or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*", // Allow only your frontend domain in production
  methods: ["GET", "POST", "DELETE"],      // Restrict methods
  credentials: true
}));
app.use(bodyparser.json());

// Connect to MongoDB
(async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB ✅");
  } catch (err) {
    console.error("MongoDB Connection Error ❌", err);
    process.exit(1); // Exit process if DB fails
  }
})();

// Routes
app.get("/", async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/", async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const insertResult = await collection.insertOne(password);
    res.json({ success: true, result: insertResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save password" });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID format" });
    }

    const db = client.db(dbName);
    const collection = db.collection("passwords");
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ success: false, message: "Password not found" });
    }

    res.json({ success: true, message: "Password deleted successfully", result: deleteResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete password" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is listening at http://localhost:${PORT}`);
});
