// jQuery Document

// Variables for 3 user inputs. Names self-explanatory. MSOC is Minimum State of Charge
var vehicle_type, msoc, opt_in, battery_capacity;

// When multiple choice is changed, update variable value
$("#mc .multi-choice .option").click(function(){
	vehicle_type = $("#mc .multi-choice .selected h4").text();
	console.log(vehicle_type);
});

// When MSOC inputs are changed, update variable value
$("#msocText, #msocSlider").change(function(){
	msoc = $("#msocText").val();
	console.log(msoc);
});

// When Opt-in inputs are changed, update variable value
$("#optinText, #optinSlider").change(function(){
	opt_in = $("#optinText").val();
	console.log(opt_in);
});

//Chris
//TO DO make dynamic
//retrieve vehicle statistics
const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://chris:delorean@cluster0.joafk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('delorean');
    const collection = database.collection('Vehicles');
    // Query for a movie that has the title 'Back to the Future'
    const query = { model: vehicle_type };
	const car = await collection.findOne(query);	  
	//retrieved variables
	battery_capacity = car.batteryKWHCapacity;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run();

//Determine the number of vehicles in the fleet
//TO DO: use zip code -> populations


