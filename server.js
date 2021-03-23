// NodeJS Document

// Dependencies
const express = require("express");
const mongoose = require("mongoose");

// Create instance of Express
const app = express();
const ejs = require("ejs");
app.set("view engine", "ejs");

// Connect to DeLorean Database
mongoose.connect("mongodb+srv://pranav:delorean@cluster0.joafk.mongodb.net/delorean?retryWrites=true&w=majority");

// Schema for the Vehicles collection within DeLorean database
var vehiclesSchema = mongoose.Schema,
	ObjectId = mongoose.Schema.ObjectId;
vehiclesSchema = new mongoose.Schema ({
	charge120: Number,
	charge240: Number,
	charge240b: Number,
	rangeA: Number,
	rangeCityA: Number,
	rangeHwyA: Number,
	make: String,
	UCity: Number,
	UCityA: Number,
	UHighway: Number,
	UHighwayA: Number,
	cityE: Number,
	model: String,
	year: Number,
	batteryKwhCapacity: Number
});

// Create model for the Vehicles collection
const Vehicles = mongoose.model("Vehicles", vehiclesSchema, "Vehicles");

// Load static folders that do not contain any NodeJS
app.use(express.static(__dirname + "/public/"));

// Load index.ejs
app.get("/", (req, res) => {
	Vehicles.find({}, function(err, cars) {
		res.render("index", {
			carsList: cars
		});
	});
});

app.listen(4000, function() {
	console.log("Server is running");
});
/*
function iterateFunc(doc) {
	console.log(JSON.stringify(doc.model, null, 4));
	client.close();
}

function errorFunc(error) {
	console.log(error);
	client.close();
}

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://pranav:delorean@cluster0.joafk.mongodb.net/delorean?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const mq = "BMW";
var q = {};
q.make = mq;

client.connect(err => {
	// Get database and from there, get collection
	const collection = client.db("delorean").collection('Vehicles');

	// Get JSON objects containing every match for the search query
	var cursor = collection.find(q);
	cursor.forEach(iterateFunc, errorFunc);

});
*/