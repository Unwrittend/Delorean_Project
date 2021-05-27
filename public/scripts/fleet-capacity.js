// jQuery Document


//---------------------FILE GLOBAL VARIABLES------------------------

// Variables for 3 user inputs. Names self-explanatory. MSOC is Minimum State of Charge
var vehicle_type,
	msoc = .5,
	opt_in = .5,
	battery_capacity = 0,
	zip_code = 95050,
	veh_pop,
	flt_cap = [],
	flt_profit,
	indiv_profit,
	PF = 1,					//power fade (1 == 100%)
	CF = 1;					//capacity fade (1 == 100%) 

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
	flt_cap_field.text((battery_capacity*veh_pop).toFixed(0));
	updatePS();
	updateFA();
});

// When multiple choice is changed, update graphs. This function is called in app.js
function updateGraphs(){

	msoc = $("#msocText").val()/100; //is a percentage;
	opt_in = $("#optinText").val()/100;

	// Get id of selected vehicle
	vehicle_type = $("#car-list .selected").attr("id");
	//console.log(vehicle_type);

	//console.log(data.batteryKWhCapacity);
	battery_capacity = $("#car-list .selected div h6").attr("property");

	calc_veh_pop();
	calc_flt_cap();
	flt_tou_profit[0].revenue = calc_revenue_pge_tou("Winter", 15);		//index 0 is winter
	flt_tou_profit[1].revenue = calc_revenue_pge_tou("Summer", 15);		//index 1 is summer
	flt_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue, flt_tou_profit[1].revenue,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));
	indiv_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue/veh_pop, flt_tou_profit[1].revenue/veh_pop,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));

	// Set the value of the HTML spans to a smaller number, expressed in larger units (e.g. Gigawatts vs Kilowatts)
	let flt_val = battery_capacity * veh_pop;
	let unit = "kWh";

	// Once for Megawatts
	if(flt_val >= 1000) {
		flt_val /= 1000;
		unit = "MWh";
	}
	// Again for Gigawatts
	if(flt_val >= 1000) {
		flt_val /= 1000;
		unit = "GWh";

		// Easter Egg -- if fleet capacity is approximately 1.21 GWh, replace unit with "Jigawatt-hours"
		if(flt_val >= 1.21 && flt_val < 1.22)
			unit = "Jigawatt-hours";
	}

	// Populate spans in HTML with the values, separated with commas (e.g. 1,000,000)
	flt_roi_field.text(flt_profit.toLocaleString());
	indiv_roi_field.text(indiv_profit.toLocaleString());
	flt_cap_field.text((flt_val).toLocaleString() + " " +unit);

	updatePS();

}

//----------------------UPDATE CALCULATIONS-----------------------


//Determine the number of vehicles in the fleet
//Assumes every person has 1 EV
function calc_veh_pop() {
	var pop = zip_code_pop_95050;//TO DO: use zip code -> populations
	veh_pop = pop * opt_in;

	//could update so that we are using average veh in household and round at the end
}

/*
function calc_flt_cap(years = 5) {
	//1. Initial fleet cap before any battery degradation
	var init_flt_cap = veh_pop * (1 - msoc) * battery_capacity * Math.min(CF, PF);
	flt_cap = veh_pop * (1 - msoc) * battery_capacity * Math.min(CF, PF);
}
*/

//update flt_cap
//Assumes all vehicles in the fleet are the same
/**
 * Calculates the fleets capacity every day
 * @param {*} years 
 * @return - A fleet with an overall decaying battery in an array
 */
function calc_flt_cap(years = 5) {
	//1. Initial fleet cap before any battery degradation
	var batt_degrad = Math.min(CF, PF) / 100;
	var init_flt_cap = veh_pop * (1 - msoc) * battery_capacity * batt_degrad;
	flt_cap[0] = veh_pop * (1 - msoc) * battery_capacity * batt_degrad;

	//2. Fleet cap over x years.
	//2a. pull charing station volts from MongoDB
	var i,
		volts = 120,		//charge station voltage rating		//TODO hook up to DB and data. currently defaulting to lvl 1 charger
		amp_hours = 12,  	//charge station amp_hour rating	//TODO hook up to DB and data. currently defaulting to lvl 1 charger
		per_veh_kWh_avail = (1 - msoc) * battery_capacity,
		temp = 295;			//arbitary hardcoded number			//TODO use map data from Arjun
	
	
	
	//perhaps make this a smaller interval?
	//previously working at a daily level
	for (i = 1; i < years * 365; i++){
		//2b. Calculate CF and PF from a day's charging

		//calculate the max amount of retrievable energy over peak hours
		var veh_amp_hour = per_veh_kWh_avail * 1000 / volts;	//converts vehicle battery to an ampere-hour value using station voltage
		var max_amps = Math.min(veh_amp_hour, amp_hours);	//whichever is worse is the bottleneck
		
		//2c. use following function to store flt_cap of the day
		
		//update CF and PF
		CF = 1 - calc_cf_calendar_aging(temp, i);
		//PF -= calc_pf_with_SOC_and_temp(msoc, max_amps, temp);		//TODO find calendar aging power fade algorithm

		//note: PF is not currently changing so PF >= CF
		//flt_cap[i] = veh_pop * (1 - msoc) * battery_capacity * Math.min(CF, PF);
		flt_cap.push(veh_pop * (1 - msoc) * battery_capacity * Math.min(CF, PF));

	}
	


	if (!(battery_capacity >= 0))	//checks for NaN
		flt_cap = 0;
	
	
	console.log(flt_cap);
	return flt_cap;
}



//TODO More the just PGE

//TODO exclude holidays

//TODO flt_cap is now an array
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
