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
let vehiclesSchema = mongoose.Schema,
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
	Vehicles.find({}, {}, {
		sort: {make: 1}
	}, function(err, cars) {

		// Make a list of the unique auto makes for the multiple choice box (remove duplicates)
		let makeList = [];
		let i=0;
		cars.forEach(car => {
			makeList.push(car.make);
			if(makeList.indexOf(makeList[i]) < i) {
				makeList.pop();
				i--;
			}
			i++;
		});

		// Render the homepage
		res.render("index", {
			makeList: makeList,
			carsList: cars
		});
	});
});

// Send list of cars with requested manufacturer
app.get("/getCarsByMake", (req, res) => {

	// Find all cars with the specified make. Sort results by Model name
	Vehicles.find({make: {$eq: req.query.make} }, {}, {
		sort: {model: 1}
	}, function(err, cars) {
		// Send results as a collection
		res.send(cars);
	});
});

// Send back car with requested id
app.get("/getCarById", (req, res) => {
	Vehicles.find({_id: {$eq: req.query._id} }, {}, function(err, cars) {
		// find() always returns an array, so simply return the first element in this case.
		res.send(cars[0]);
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