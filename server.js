// NodeJS Document

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Create instance of Express
const app = express();
const ejs = require("ejs");
app.set("view engine", "ejs");

// Use cookie Parser, set variables for determining style and view preferences
app.use(cookieParser());
let user_mode, user_view;

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

// Load static folders that do not contain any NodeJS
app.use(express.static(__dirname + "/public/"));

// Load index.ejs
app.get("/", (req, res) => {

	// Read cookie to find out user's dark/light mode preference. Default is light
	user_mode = req.cookies.mode;
	if(!(user_mode))
		user_mode = "light";

	// Render the homepage
	res.render("index", {
		user_mode: user_mode,
	});
});

app.get("/about", (req, res) => {

	// Read cookie to find out user's dark/light mode preference. Default is light
	user_mode = req.cookies.mode;
	if(!(user_mode))
		user_mode = "light";

	// Render the homepage
	res.render("about", {
		user_mode: user_mode,
	});
});

app.get("/user-guide", (req, res) => {

	// Read cookie to find out user's dark/light mode preference. Default is light
	user_mode = req.cookies.mode;
	if(!(user_mode))
		user_mode = "light";

	// Render the homepage
	res.render("user-guide", {
		user_mode: user_mode,
	});
});

// Load project.ejs
app.get("/project", (req, res) => {

	// Read cookie to find out user's dark/light mode preference. Default is light
	user_mode = req.cookies.mode;
	if(!(user_mode))
		user_mode = "light";

	// Read cookie to find user's view preference (organizer/individual). Default is organizer
	if(!(req.cookies.view))
		res.cookie("view", "organizer");
	user_view = req.cookies.view;

	// Send JSON object with list of vehicle makes
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

		// Render the project page
		res.render("project", {
			user_mode: user_mode,
			user_view: user_view,
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
	// Read cookie to find out user's dark/light mode preference. Default is light
	user_mode = req.cookies.mode;
	if(!(user_mode))
		user_mode = "light";

	res.render("404", {
		user_mode: user_mode
	});
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