// jQuery Document


//---------------------FILE GLOBAL VARIABLES------------------------

// Variables for 3 user inputs. Names self-explanatory. MSOC is Minimum State of Charge
var vehicle_type, msoc = .5, opt_in = .5, battery_capacity = 0, zip_code = 95050,
	veh_pop, flt_cap, flt_profit, indiv_profit;

const indiv_roi_field = $("#indiv-roi");
const flt_roi_field = $("#flt-roi");
const flt_cap_field = $("#fleet-capacity");

var flt_tou_profit =[
	{season: "Winter", revenue: 0, id: 1},
	{season: "Summer", revenue: 0, id: 2}
]

//PGE_TOU_D holds PGE's time of use rates and their on and off peak hours
//in military time
	let PGE_TOU_D = {
		winter_peak : 0.29231,
		winter_off_peak : 0.27493,
		winter_peak_start : 1700,
		winter_peak_end : 2000,
		winter_month_start: "October",
		winter_length: 243,

		summer_peak : 0.36618,
		summer_off_peak : 0.27122,
		summer_peak_start : 1700,
		summer_peak_end : 2000,
		summer_month_start: "June",
		summer_length : 122
	}

var percent_flt_avail = [ 98.72404738009172, 98.94407289973621, 99.14171692141903, 99.2652592375488, 99.3765154139245, 99.46787692544532, 99.55432398106454, 99.61723493763674, 99.6897083596079, 99.74791209637071, 99.80963884670155, 99.8363426974442, 99.87867807057278, 99.90940822253603, 99.94046403121568, 99.9705428697462, 99.7580962700464, 99.56391605161954, 99.15323332711625, 98.85356993774036, 98.15228300160756, 97.62090005595374, 96.51781194212785, 95.65973609963912, 93.88931816365135, 92.58302025880832, 89.98170401357103, 87.76611334630029, 83.61511520846483, 80.21235778423177, 75.05866261668102, 71.54956347197474, 67.21658243999764, 64.9553998324347, 61.50921164430003, 59.42474221310362, 55.51857871566923, 53.9576764689337, 51.14950899848729, 49.78047776800775, 45.994629624695385, 44.99995559226582, 43.165590519244915, 42.59965835649925, 40.507284348642195, 40.313311366307545, 39.43824216425528, 39.40709754010763, 38.651425932340466, 38.944132110048315, 38.91349077355303, 39.26591055098155, 38.76265250355997, 39.208802204991876, 39.33823594717245, 39.932441033930374, 39.780773819568424, 40.55166247753726, 41.07369019388408, 42.06294648275962, 42.78279585172533, 44.27957333049169, 45.70532803993127, 47.39240746168406, 49.06924349944776, 51.097877606364364, 53.02313050840919, 55.006054254409186, 57.0098200302565, 59.66110977887937, 62.2160939549232, 64.4942699220497, 66.4808054970854, 68.62555102596673, 70.68488567969007, 72.5788459318075, 74.46140819885203, 76.37763152830689, 78.29802918476284, 80.12842716687534, 81.94920347327688, 83.79008168062548, 85.59676593275482, 87.27312828802265, 88.91574076541167, 90.42213991988844, 91.81464803910247, 92.94902880285628, 94.01892953676811, 94.93698542538168, 95.8113441036891, 96.45741742381854, 97.05760275209529, 97.56278513465905, 98.004523667842, 98.36247960944878]

//----------------CONSTANTS---------------------
//this is the average vehicles owned per household
const average_veh_per_home = 1.85988258;
const zip_code_pop_95050 = 38699;


//----------------------JQUERY UPDATES-----------------------
//Retrieve zip code from map
$("#zip").change(function(){
	zip_code = $("#zip").val();
	
	calc_veh_pop();
	calc_flt_cap();
	flt_tou_profit[0].revenue = calc_revenue_pge_tou("Winter", 15);		//index 0 is winter
	flt_tou_profit[1].revenue = calc_revenue_pge_tou("Summer", 15);		//index 1 is summer
	flt_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue, flt_tou_profit[1].revenue,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));
	indiv_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue/veh_pop, flt_tou_profit[1].revenue/veh_pop,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));
	
	flt_roi_field.text(flt_profit);
	indiv_roi_field.text(indiv_profit);
	flt_cap_field.text((battery_capacity*veh_pop).toFixed(0))
	clearGraph();
	updatePS();
	updateFA();
});

// When multiple choice is changed, update variable value
$("#mc .multi-choice .option").click(function(){
	vehicle_type = $("#mc .multi-choice .selected h4").text();

	//hardcode: remove after H4H
	switch (vehicle_type) {
		case "Tesla Model S":
			battery_capacity = 80;
			break;
		case "Nissan Leaf":
			battery_capacity = 62;
			break;
		case "Nissan ENV-200":
			battery_capacity = 80;
			break;
	}

	//TO DO make car selection dynamic from mongo
	//retrieve vehicle statistics
	// const { MongoClient } = require("mongodb");
	// const uri =
	//   "mongodb+srv://chris:delorean@cluster0.joafk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
	// const client = new MongoClient(uri);
	// async function run() {
	//   try {
	//     await client.connect();
	//     const database = client.db('delorean');
	//     const collection = database.collection('Vehicles');
	//     // Query for a movie that has the title 'Back to the Future'
	//     const query = { model: vehicle_type };
	// 	const car = await collection.findOne(query);	  
	// 	//retrieved variables
	// 	battery_capacity = car.batteryKWHCapacity;
	//   } finally {
	//     // Ensures that the client will close when you finish/error
	//     await client.close();
	//   }
	// }
	// run();

	calc_veh_pop();
	calc_flt_cap();
	flt_tou_profit[0].revenue = calc_revenue_pge_tou("Winter", 15);		//index 0 is winter
	flt_tou_profit[1].revenue = calc_revenue_pge_tou("Summer", 15);		//index 1 is summer
	flt_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue, flt_tou_profit[1].revenue,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));
	indiv_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue/veh_pop, flt_tou_profit[1].revenue/veh_pop,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));

	// Populate spans in HTML with the values
	flt_roi_field.text(flt_profit.toFixed(2));
	indiv_roi_field.text(indiv_profit.toFixed(2));
	flt_cap_field.text((battery_capacity*veh_pop).toFixed(0))
	clearGraph();
	updatePS();
	updateFA();

});

// When MSOC inputs are changed, update variable value
$("#msocText, #msocSlider").change(function(){
	msoc = $("#msocText").val()/100;				//is a percentage;

	calc_veh_pop();
	calc_flt_cap();
	flt_tou_profit[0].revenue = calc_revenue_pge_tou("Winter", 15);		//index 0 is winter
	flt_tou_profit[1].revenue = calc_revenue_pge_tou("Summer", 15);		//index 1 is summer
	flt_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue, flt_tou_profit[1].revenue,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));
	indiv_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue/veh_pop, flt_tou_profit[1].revenue/veh_pop,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));
	
	flt_roi_field.text(flt_profit.toFixed(2));
	indiv_roi_field.text(indiv_profit.toFixed(2));
	flt_cap_field.text((battery_capacity*veh_pop).toFixed(0))
	clearGraph();
	updatePS();
	updateFA();
});

// When Opt-in inputs are changed, update variable value
$("#optinText, #optinSlider").change(function(){
	opt_in = $("#optinText").val()/100;		//is a percentage

	calc_veh_pop();
	calc_flt_cap();
	flt_tou_profit[0].revenue = calc_revenue_pge_tou("Winter", 15);		//index 0 is winter
	flt_tou_profit[1].revenue = calc_revenue_pge_tou("Summer", 15);		//index 1 is summer
	flt_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue, flt_tou_profit[1].revenue,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));
	indiv_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue/veh_pop, flt_tou_profit[1].revenue/veh_pop,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));
	console.log(indiv_profit);
	console.log(flt_profit);

	flt_roi_field.text(flt_profit.toFixed(2));
	indiv_roi_field.text(indiv_profit.toFixed(2));
	flt_cap_field.text((battery_capacity*veh_pop).toFixed(0))
	clearGraph();
	updatePS();
	updateFA();
});

//----------------------UPDATE CALCULATIONS-----------------------

//Determine the number of vehicles in the fleet
function calc_veh_pop() {
	var pop = zip_code_pop_95050;//TO DO: use zip code -> populations
	veh_pop = pop * opt_in;
}

//update flt_cap
function calc_flt_cap() {
	flt_cap = veh_pop * (1 - msoc) * battery_capacity;
	if (!(battery_capacity >= 0))	//checks for NaN
		flt_cap = 0;
}


//TO DO exclude holidays
/**
 * Calculates the money saved using PGE's TOU-D plan over one day
 * @param {*} season - Either Winter or Summer
 * @param {*} division_of_time - For example: hourly inputs would be 60
 */
function calc_revenue_pge_tou(season, division_of_time) {
	var revenue;

	switch (season) {
		case "Winter":
			//create subarray of percent_flt_avail within the range of peak hours
			var start_index = mil_time_to_minutes(PGE_TOU_D.winter_peak_start) / division_of_time;
			var end_index = mil_time_to_minutes(PGE_TOU_D.winter_peak_end) / division_of_time;
			var peak_avail = percent_flt_avail.slice(start_index, end_index);

			//All vehicles that can will participate in this V2G event. Thus the highest availability over the peak hours is 
			//used to determine how much energy is discharged
			//formula: [max availability over peak hours (percentage)] * fleet capacity
			var discharged_energy = Math.max(...peak_avail)/100 * flt_cap;
			//console.log(discharged_energy);

			revenue = discharged_energy * (PGE_TOU_D.winter_peak-PGE_TOU_D.winter_off_peak);
			break;
		case "Summer":
			//create subarray of percent_flt_avail within the range of peak hours
			var start_index = mil_time_to_minutes(PGE_TOU_D.summer_peak_start) / division_of_time;
			var end_index = mil_time_to_minutes(PGE_TOU_D.summer_peak_end) / division_of_time;
			var peak_avail = percent_flt_avail.slice(start_index, end_index);

			//All vehicles that can will participate in this V2G event. Thus the highest availability over the peak hours is 
			//used to determine how much energy is discharged
			var discharged_energy = Math.max(...peak_avail)/100 * flt_cap;
			revenue = discharged_energy * (PGE_TOU_D.summer_peak - PGE_TOU_D.summer_off_peak);
			break;
	}

	return revenue;
}

/**
 * convert daily profit to annual profit
 * @param {*} winter_rev - revenue from winter billing (daily)
 * @param {*} summer_rev - revenue from summer billing (daily)
 * @param {*} winter_length - days of winter billing
 * @param {*} summer_length - days of summer billing
 */
function calc_annual_profit(winter_rev, summer_rev, winter_length, summer_length) {
	return winter_rev*winter_length + summer_rev*summer_length;
}

/**
 * Converts military time to minutes since 0000
 * @param {*} mil_time - military time
 */
function mil_time_to_minutes(mil_time) {
	var hours = mil_time / 100;
	var minutes = mil_time % 100;
	return (minutes + hours * 60);
}
