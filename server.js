// NodeJS Document

// Dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

// Port number
const port = 3000;

// Create instance of Express
const app = express();
const ejs = require("ejs");
app.set("view engine", "ejs");

// For Body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// E-mail info
const emailHost = process.env.EMAIL_HOST;
const emailAddress = process.env.EMAIL_USR;
const emailPort = process.env.EMAIL_PORT;
const emailPass = process.env.EMAIL_PASS;

// Use cookie Parser, set variables for determining style and view preferences
app.use(cookieParser());
let user_mode, user_view;

// Connect to DeLorean Database
mongoose.connect(process.env.MONGO_URI);

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

	// Render the page
	res.render("about", {
		user_mode: user_mode,
		captcha_token: process.env.CAPTCHA_SITEKEY,
	});
});

app.get("/user-guide", (req, res) => {

	// Read cookie to find out user's dark/light mode preference. Default is light
	user_mode = req.cookies.mode;
	if(!(user_mode))
		user_mode = "light";

	// Render the page
	res.render("user-guide", {
		user_mode: user_mode,
	});
});

app.get("/what-is-v2g", (req, res) => {

	// Read cookie to find out user's dark/light mode preference. Default is light
	user_mode = req.cookies.mode;
	if(!(user_mode))
		user_mode = "light";

	// Render the page
	res.render("what-is-v2g", {
		user_mode: user_mode,
	});
});

// Load project.ejs
app.get(["/project", "/calculator"], (req, res) => {

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

let transporter = nodemailer.createTransport({
	host: emailHost,
	port: emailPort,
	secure: true,
	auth: {
		user: emailAddress,
		pass: emailPass
	}
});

app.get("/sendmail", (req, res) => {

	// Make verification URL
	const secret_key = process.env.SECRET_KEY;
	const token = req.query.captcha;
	const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}&remoteip=${req.connection.remoteAddress}`;

	// Error if no captcha token was passed
	if(
		token === undefined ||
		token === "" ||
		token === null
	){
		res.send({status: "failed", msg: "Captcha token is undefined"});
	}

	// Make request to verification URL
	fetch(url)
		.then(response => response.json())
		.then(obj => {
			//console.log(obj);
			// We got a response. Now check if user is a robot or not
			// If user is a human
			if(obj.success) {
				// Setup the e-mail
				let emailBody = `Name: ${req.query.name}\nSubject: ${req.query.subject}\nE-mail: ${req.query.email}\n\n${req.query.body}\n\nSent from the contact form on deloreanenergy.us`;

				let mailOptions = {
					from: req.query.email,
					to: emailAddress,
					subject: req.query.subject,
					text: emailBody
				};

				// Send the e-mail
				let info = transporter.sendMail(mailOptions, function(err, data){
					if(err) {
						res.send({status: "failed", msg: "Couldn't send e-mail, sorry :("});
					}
					else {
						//console.log(data.response);
						res.send({status: "success", msg: "E-mail has been sent!"});
					}
				});
			}

			// If user is a robot
			else {
				res.send({status: "failed", msg: "Captcha failed :( <br>Perhaps try reloading the page?"});
			}

	}).catch((err) => res.send({err}));
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

app.listen(port, () => console.log(`App listening on port ${port}!`));
