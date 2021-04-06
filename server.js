// NodeJS Document

// Dependencies
const express = require("express");
const mongoose = require("mongoose");

// Create instance of Express
const app = express();
const ejs = require("ejs");
app.set("view engine", "ejs");

// Connect to DeLorean Database
mongoose.connect("mongodb+srv://[username]:[password]@cluster0.joafk.mongodb.net/delorean?retryWrites=true&w=majority");

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
Vehicles.count(function(err, count) {
	console.log(count);
});
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

// In case request cannot be processed, show the 404 page
app.use(function(req, res){
	res.render("404");
});


app.listen(4000, function() {
	console.log("Server is running");
});

//------------------------------------------  CPanel Server Code
/**
var http = require('http');
var server = http.createServer(function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/plain'});
	var message = 'It works!\n',
		version = 'NodeJS ' + process.versions.node + '\n',
		response = [message, version].join('\n');
	res.end(response);
});
server.listen(4000);
*/