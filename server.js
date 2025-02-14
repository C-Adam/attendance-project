const { spawn } = require("child_process");
const { MongoClient } = require("mongodb");
const lodash = require("lodash");
const students = require("./sec-one-students.json");
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "attendance-project")));

const uri =
  "mongodb+srv://admin:z3WrHoZQkpWYORaz@cluster0.qeklbdv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "ENT105-01-S25";
const collectionName = new Date().toLocaleDateString(); //Current Date, Ex: 13/02/2025

async function UpsertById(client, idOfListing, updatedListing) {
  const query = { student_id: idOfListing };
  const update = { $set: updatedListing };
  const options = { upsert: true };

  const result = await client
    .db(dbName)
    .collection(collectionName)
    .updateOne(query, update, options);
  if (result) {
    console.log("Successfully upserted listing");
  }
}

async function FindListingById(client, idOfListing) {
  let query = { student_id: idOfListing };
  const result = await client
    .db(dbName)
    .collection(collectionName)
    .findOne(query);

  if (result) {
    return result;
  }
}

async function InsertMany(client, listings) {
  const result = await client
    .db(dbName)
    .collection(collectionName)
    .insertMany(listings);
  console.log("Successfuly created all listings.");
}

async function CollectionExists(client) {
  let result = await client.db(dbName).listCollections().toArray();
  let collections = [...result.map((collection) => collection.name)];
  if (collections.includes(collectionName)) {
    return true;
  }
  return false;
}

async function CreateNewDay() {
  const client = new MongoClient(uri);
  let collectionExists = await CollectionExists(client);

  if (collectionExists) {
    console.log("Collection already exists!");
  } else {
    console.log("Creating new collection.");
    await InsertMany(client, students);
  }
}

async function UpdateAttendance(scannedId) {
  const client = new MongoClient(uri);

  let existingListing = await FindListingById(client, scannedId);
  let updatedListing = lodash.cloneDeep(existingListing);
  updatedListing.attendance = "Present";

  await UpsertById(client, scannedId, updatedListing);
}

async function ScanCard() {
  const childPython = spawn("python", ["app.py"]);
  childPython.stdout.on("data", (data) => {
    let scannedId = data.toString().trim();
    console.log(scannedId);
    UpdateAttendance(scannedId).catch(console.error);
  });
}

async function main() {
  try {
    await ScanCard();
  } catch (error) {
    console.error(error);
  }
}

async function FetchStudentData() {
  const client = new MongoClient(uri);
  const result = await client
    .db(dbName)
    .collection(collectionName)
    .find()
    .toArray();
  return result;
}

app.get("/students", async (req, res) => {
  try {
    let updatedStudents = await FetchStudentData();
    res.json(updatedStudents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching data" });
  }
});

CreateNewDay().catch(console.error);
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
main();
