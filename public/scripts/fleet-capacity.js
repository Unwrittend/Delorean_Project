// jQuery Document

/*****************************************************************************
 * FILE GLOBAL VARIABLES
 *****************************************************************************/

// Variables for 3 user inputs. Names self-explanatory. MSOC is Minimum State of Charge
let vehicle_type, /*msoc = .5,*/ opt_in = .5, /*battery_capacity = 0,*/ zip_code = 95050,
	veh_pop, flt_cap, flt_profit, indiv_profit;

const indiv_roi_field = $("#indiv-roi");
const flt_roi_field = $("#flt-roi");
const flt_cap_field = $("#fleet-capacity");

let flt_tou_profit =[
	{season: "Winter", revenue: 0, id: 1},
	{season: "Summer", revenue: 0, id: 2}
]

//PGE_TOU_D holds PGE's time of use rates and their on and off peak hours
//in military time
const PGE_TOU_D = {
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
};

const PF_per_summer = 100; //power fade percentage. Assumed 100% for now.
const PF_per_winter = 100; //power fade percentage. Assumed 100% for now.

const average_veh_per_home = 1.85988258; //this is the average vehicles owned per household
const zip_code_pop_95050 = 38699;

const percent_flt_avail = [ 98.72404738009172, 98.94407289973621, 99.14171692141903, 99.2652592375488, 99.3765154139245, 99.46787692544532, 99.55432398106454, 99.61723493763674, 99.6897083596079, 99.74791209637071, 99.80963884670155, 99.8363426974442, 99.87867807057278, 99.90940822253603, 99.94046403121568, 99.9705428697462, 99.7580962700464, 99.56391605161954, 99.15323332711625, 98.85356993774036, 98.15228300160756, 97.62090005595374, 96.51781194212785, 95.65973609963912, 93.88931816365135, 92.58302025880832, 89.98170401357103, 87.76611334630029, 83.61511520846483, 80.21235778423177, 75.05866261668102, 71.54956347197474, 67.21658243999764, 64.9553998324347, 61.50921164430003, 59.42474221310362, 55.51857871566923, 53.9576764689337, 51.14950899848729, 49.78047776800775, 45.994629624695385, 44.99995559226582, 43.165590519244915, 42.59965835649925, 40.507284348642195, 40.313311366307545, 39.43824216425528, 39.40709754010763, 38.651425932340466, 38.944132110048315, 38.91349077355303, 39.26591055098155, 38.76265250355997, 39.208802204991876, 39.33823594717245, 39.932441033930374, 39.780773819568424, 40.55166247753726, 41.07369019388408, 42.06294648275962, 42.78279585172533, 44.27957333049169, 45.70532803993127, 47.39240746168406, 49.06924349944776, 51.097877606364364, 53.02313050840919, 55.006054254409186, 57.0098200302565, 59.66110977887937, 62.2160939549232, 64.4942699220497, 66.4808054970854, 68.62555102596673, 70.68488567969007, 72.5788459318075, 74.46140819885203, 76.37763152830689, 78.29802918476284, 80.12842716687534, 81.94920347327688, 83.79008168062548, 85.59676593275482, 87.27312828802265, 88.91574076541167, 90.42213991988844, 91.81464803910247, 92.94902880285628, 94.01892953676811, 94.93698542538168, 95.8113441036891, 96.45741742381854, 97.05760275209529, 97.56278513465905, 98.004523667842, 98.36247960944878]

/*****************************************************************************
 * BATTERY INVARIANTS -- values set in project.js
 *****************************************************************************/

let msoc;// = 0.2; //min state of charge

let battery_capacity;// = 82; // in kWh, Tesla Model 3

let diversity_constant; // = 1.0; // what percentage of the fleet is this car. E.g. With two cars, could be 0.7 and 0.3

const battery_cost_per_kwH = 143;

const total_battery_cost = battery_capacity * battery_cost_per_kwH;

/*****************************************************************************
 * TEMPERATURES: AVERAGE SEASONAL TEMPS OVER 4 MONTHS FROM 5PM-8PM IN KELVIN!!!
 *****************************************************************************/

// Oct 01->Jan 29
const winterKelvinTemperatures = [{"index":0,"temp":305.01666666666665},{"index":1,"temp":305.04},{"index":2,"temp":304.02666666666664},{"index":3,"temp":301.25333333333333},{"index":4,"temp":301.52666666666664},{"index":5,"temp":298.28333333333336},{"index":6,"temp":292.63000000000005},{"index":7,"temp":291.69666666666666},{"index":8,"temp":294.59},{"index":9,"temp":294.33666666666664},{"index":10,"temp":296.4866666666666},{"index":11,"temp":300.11},{"index":12,"temp":301.1066666666666},{"index":13,"temp":303.26666666666665},{"index":14,"temp":304.56333333333333},{"index":15,"temp":304.60999999999996},{"index":16,"temp":305.91333333333336},{"index":17,"temp":299.97},{"index":18,"temp":299.59999999999997},{"index":19,"temp":299.1066666666666},{"index":20,"temp":299.43666666666667},{"index":21,"temp":295.80333333333334},{"index":22,"temp":292.47333333333336},{"index":23,"temp":292.05333333333334},{"index":24,"temp":292.11666666666673},{"index":25,"temp":292.9066666666667},{"index":26,"temp":294.95666666666665},{"index":27,"temp":294.30333333333334},{"index":28,"temp":294.95},{"index":29,"temp":293.4266666666667},{"index":30,"temp":294.96},{"index":31,"temp":295.82666666666665},{"index":32,"temp":296.15999999999997},{"index":33,"temp":292.07666666666665},{"index":34,"temp":294.18333333333334},{"index":35,"temp":295.82666666666665},{"index":36,"temp":286.46666666666664},{"index":37,"temp":286.40333333333336},{"index":38,"temp":281.91},{"index":39,"temp":285.19666666666666},{"index":40,"temp":286.99333333333334},{"index":41,"temp":286.9633333333333},{"index":42,"temp":287.17333333333335},{"index":43,"temp":287.22333333333336},{"index":44,"temp":285.76666666666665},{"index":45,"temp":289.72},{"index":46,"temp":292.58},{"index":47,"temp":287.8233333333333},{"index":48,"temp":288.73333333333335},{"index":49,"temp":287.42333333333335},{"index":50,"temp":287.8333333333333},{"index":51,"temp":287.47999999999996},{"index":52,"temp":286.3866666666666},{"index":53,"temp":286.52},{"index":54,"temp":288.38000000000005},{"index":55,"temp":286.07666666666665},{"index":56,"temp":287.28333333333336},{"index":57,"temp":286.69666666666666},{"index":58,"temp":286.45666666666665},{"index":59,"temp":287.6133333333334},{"index":60,"temp":286.57666666666665},{"index":61,"temp":287.8433333333333},{"index":62,"temp":287.51666666666665},{"index":63,"temp":288.06},{"index":64,"temp":288.88333333333327},{"index":65,"temp":286.7966666666667},{"index":66,"temp":285.4766666666667},{"index":67,"temp":290.98},{"index":68,"temp":290.43},{"index":69,"temp":287.58},{"index":70,"temp":287.64000000000004},{"index":71,"temp":284.26},{"index":72,"temp":285.01},{"index":73,"temp":286.6933333333334},{"index":74,"temp":284.5733333333333},{"index":75,"temp":285.47666666666663},{"index":76,"temp":287.69},{"index":77,"temp":284.5066666666667},{"index":78,"temp":285.65333333333336},{"index":79,"temp":285.5466666666666},{"index":80,"temp":286.3866666666667},{"index":81,"temp":285.81333333333333},{"index":82,"temp":285.60666666666674},{"index":83,"temp":284.96},{"index":84,"temp":286.46000000000004},{"index":85,"temp":287.8333333333333},{"index":86,"temp":285.76},{"index":87,"temp":285.14000000000004},{"index":88,"temp":284.53333333333336},{"index":89,"temp":285.53},{"index":90,"temp":285.31},{"index":91,"temp":285.58},{"index":92,"temp":286.34999999999997},{"index":93,"temp":285.99666666666667},{"index":94,"temp":286.0566666666667},{"index":95,"temp":286.24333333333334},{"index":96,"temp":284.2666666666667},{"index":97,"temp":287.0933333333333},{"index":98,"temp":286.1266666666666},{"index":99,"temp":286.40000000000003},{"index":100,"temp":286.87},{"index":101,"temp":287.28000000000003},{"index":102,"temp":287.18666666666667},{"index":103,"temp":289.19666666666666},{"index":104,"temp":291.51000000000005},{"index":105,"temp":291.50666666666666},{"index":106,"temp":291.0833333333333},{"index":107,"temp":292.24},{"index":108,"temp":294.42333333333335},{"index":109,"temp":294.37999999999994},{"index":110,"temp":289.63},{"index":111,"temp":290.2133333333333},{"index":112,"temp":287.49666666666667},{"index":113,"temp":282.43333333333334},{"index":114,"temp":283.93},{"index":115,"temp":281.3833333333334},{"index":116,"temp":281.96000000000004},{"index":117,"temp":281.59666666666664},{"index":118,"temp":280.49},{"index":119,"temp":282.25},{"index":120,"temp":284.05},{"index":121,"temp":286.81333333333333}];


/*
 * ==============================================================================
 * @PRANAV => UPDATE THIS VALUE (CURRENTLY IDENTICAL TO THE WINTER TEMPERATURES) [Pranav] Not anymore.
 * ==============================================================================
 */

// June 01->Sept 30
const summerKelvinTemperatures = [{"index":0,"temp":299.59},{"index":1,"temp":298.91},{"index":2,"temp":301.47},{"index":3,"temp":298.39},{"index":4,"temp":298.84666666666664},{"index":5,"temp":295.59},{"index":6,"temp":291.59999999999997},{"index":7,"temp":291.79},{"index":8,"temp":290.95666666666665},{"index":9,"temp":292.51000000000005},{"index":10,"temp":295.87},{"index":11,"temp":297.90333333333336},{"index":12,"temp":297.8633333333333},{"index":13,"temp":296.14000000000004},{"index":14,"temp":298.46333333333337},{"index":15,"temp":303.81666666666666},{"index":16,"temp":308.68333333333334},{"index":17,"temp":307.11999999999995},{"index":18,"temp":302.3},{"index":19,"temp":301.0566666666667},{"index":20,"temp":298.33666666666664},{"index":21,"temp":297.6433333333334},{"index":22,"temp":296.6066666666666},{"index":23,"temp":296.06},{"index":24,"temp":298.66333333333336},{"index":25,"temp":300.6066666666666},{"index":26,"temp":299.53},{"index":27,"temp":298.3066666666667},{"index":28,"temp":300.3666666666667},{"index":29,"temp":295.55333333333334},{"index":30,"temp":297.0233333333333},{"index":31,"temp":295.98333333333335},{"index":32,"temp":295.7866666666667},{"index":33,"temp":296.17333333333335},{"index":34,"temp":295.6166666666666},{"index":35,"temp":296.77},{"index":36,"temp":296.41333333333336},{"index":37,"temp":303.8866666666667},{"index":38,"temp":303.4033333333333},{"index":39,"temp":302.9766666666667},{"index":40,"temp":297.99666666666667},{"index":41,"temp":295.8333333333333},{"index":42,"temp":294.25666666666666},{"index":43,"temp":296.53},{"index":44,"temp":295.09666666666664},{"index":45,"temp":297.30333333333334},{"index":46,"temp":299.94},{"index":47,"temp":301.1066666666666},{"index":48,"temp":296.0},{"index":49,"temp":296.38666666666666},{"index":50,"temp":297.3433333333333},{"index":51,"temp":298.3333333333333},{"index":52,"temp":299.18666666666667},{"index":53,"temp":295.99666666666667},{"index":54,"temp":300.6533333333333},{"index":55,"temp":298.9533333333333},{"index":56,"temp":299.05333333333334},{"index":57,"temp":298.75666666666666},{"index":58,"temp":299.07},{"index":59,"temp":298.91},{"index":60,"temp":299.03},{"index":61,"temp":299.32},{"index":62,"temp":299.75666666666666},{"index":63,"temp":300.24333333333334},{"index":64,"temp":296.81666666666666},{"index":65,"temp":292.5133333333334},{"index":66,"temp":298.45000000000005},{"index":67,"temp":301.50666666666666},{"index":68,"temp":302.0466666666667},{"index":69,"temp":303.7733333333333},{"index":70,"temp":300.0133333333334},{"index":71,"temp":297.5933333333333},{"index":72,"temp":302.5},{"index":73,"temp":306.94},{"index":74,"temp":310.9666666666667},{"index":75,"temp":309.4066666666667},{"index":76,"temp":306.90999999999997},{"index":77,"temp":303.28},{"index":78,"temp":308.0933333333333},{"index":79,"temp":304.11333333333334},{"index":80,"temp":300.63666666666666},{"index":81,"temp":301.17},{"index":82,"temp":301.0533333333333},{"index":83,"temp":298.7666666666667},{"index":84,"temp":300.44},{"index":85,"temp":298.56},{"index":86,"temp":295.27},{"index":87,"temp":297.8833333333333},{"index":88,"temp":297.86333333333334},{"index":89,"temp":297.07},{"index":90,"temp":297.88},{"index":91,"temp":296.9166666666667},{"index":92,"temp":295.13000000000005},{"index":93,"temp":295.80333333333334},{"index":94,"temp":295.94},{"index":95,"temp":301.0833333333333},{"index":96,"temp":309.24},{"index":97,"temp":311.8866666666667},{"index":98,"temp":309.71666666666664},{"index":99,"temp":301.15000000000003},{"index":100,"temp":290.91666666666663},{"index":101,"temp":292.30333333333334},{"index":102,"temp":296.8066666666667},{"index":103,"temp":300.6033333333333},{"index":104,"temp":295.43333333333334},{"index":105,"temp":295.70666666666665},{"index":106,"temp":297.37666666666667},{"index":107,"temp":298.29},{"index":108,"temp":297.55},{"index":109,"temp":296.0333333333333},{"index":110,"temp":298.60333333333335},{"index":111,"temp":301.8633333333333},{"index":112,"temp":297.1366666666666},{"index":113,"temp":297.25666666666666},{"index":114,"temp":297.4766666666667},{"index":115,"temp":297.7866666666667},{"index":116,"temp":295.2033333333333},{"index":117,"temp":299.3533333333333},{"index":118,"temp":305.2366666666667},{"index":119,"temp":307.62333333333333},{"index":120,"temp":299.47666666666663},{"index":121,"temp":302.9866666666667}];

/*****************************************************************************
 * GET NUMBER OF SEASONS OPERATING UNDER
 *****************************************************************************/

/*
 * ===========================================================================
 * @PRANAV => UPDATE THIS FUNCTION
 * ===========================================================================
 */

function get_total_years() {
	return $("#years-inp").val();
}

/*****************************************************************************
 * GET CF
 *****************************************************************************/

/**
 * Algorithm from Cordoba-Arenas et al. 2015
 * Cycle aging algorithm
 * calculates the capacity lose (%) of capacity fade under SOC, total Ampere hours sent, and Temp conditions
 *
 * @param {*} SOC_min = the minimum SOC
 * @param {*} Ah = Ampere-hour throughput ie the total current to the battery over an hour
 *                      (do we control this? Let's say the CR [ie C] is 1C == 2A)
 * @param {*} tempurature = tempurature of the cells in the vehicle (Unit: Kelvin)
 * @param {*} time_cd = time in charge depleting mode (Hybrid only. If full EV, set to 1)
 * @param {*} time_cs = time in charge sustain mode (Hybrid only. If full EV, set to 0)
 * @returns Q_loss-cycle, a percentage of capacity lose
 */
function calc_cf_cycle_aging_with_SOC_and_temp(SOC_min, Ah, tempurature, time_cd = 1, time_cs = 0) {
	//constants
	const a_c = 137,
		B_c = 420,
		y_c = 9610,
		b_c = 0.34,
		c_c = 3,
		E_a = 22406, //Unit: J/mol
		R   = 8.314, //Unit: J/(mol*K)
		z   = 0.48;

	const ratio = time_cd / (time_cd + time_cs);

	return (a_c + (B_c * Math.pow(ratio, b_c)) + (y_c * Math.pow((SOC_min - 0.25), c_c))) * Math.exp((-E_a / (R * tempurature))) * Math.pow(Ah, z);
}


// Returns the Ampere-hour of the given model
//   => <voltOfChargingStation> is variable, BUT for our math can temporarily be 120V for a lvl1 charging station
//   => <kWhPerMile> & <milesDrivenPerYr> are Model-Specific
function get_ampHr(milesDrivenPerYr, kWhPerMile, voltOfChargingStation = 240) {
	const kWhPerYr = milesDrivenPerYr * kWhPerMile;
	return 1000 * kWhPerYr / voltOfChargingStation;
}


// Returns the Ampere-hour of the given model
function get_ampHr_per_day(kWhPerDay, voltOfChargingStation = 240) {
	return 1000 * kWhPerDay / voltOfChargingStation;
}


// Derive the CF per day [over the 3hr intensive period where battery degredation occurs (5pm-8pm)] from the CF per year
function get_CF_Per3Hr(cfPerYear) {
	return cfPerYear / 365;
}


// CF = Capacity Fade = Battery Degredation
function get_3hr_CF(temp3hrAvgValue) {
	const avgEv_milesDrivenPerYr = 9435; // https://www.autoexpress.co.uk/tesla/352144/tesla-drivers-cover-higher-annual-mileages-owners-any-other-car
	const avgEv_kWhPerMile       = 0.3;  // https://www.myev.com/research/comparisons/evs-with-the-best-mpge-ratings-for-2019/slide-4
	// const avgEv_amphrPerYear     = get_ampHr(avgEv_milesDrivenPerYr, avgEv_kWhPerMile); // DRIVING (for debugging/relativity computations)
	const avgEv_amphrPerYear = get_ampHr_per_day(battery_capacity * (1-msoc)) * 365; // CHARGING (what we care about)
	return get_CF_Per3Hr(calc_cf_cycle_aging_with_SOC_and_temp(msoc, avgEv_amphrPerYear, temp3hrAvgValue));
}


function get_CF_for_season(avgSeasonKelvinTemps) {
	let CF = 0;
	for(let temp of avgSeasonKelvinTemps)
		CF += get_3hr_CF(temp.temp);
	return CF;
}


function convert_CF_to_cost(CF) {
	return CF/100*battery_cost_per_kwH*battery_capacity;
}

/*****************************************************************************
 * SUMMER CF
 *****************************************************************************/

const CF_per_summer = get_CF_for_season(summerKelvinTemperatures);

/*****************************************************************************
 * WINTER CF
 *****************************************************************************/

const CF_per_winter = get_CF_for_season(winterKelvinTemperatures);

/*****************************************************************************
 * VEH_POP
 *****************************************************************************/

//Determine the number of vehicles in the fleet
//Assumes every person has 1 EV
function get_veh_pop() {
	const average_veh_per_household = 1.6;
	const zip_code_pop_95050 = 38699 * average_veh_per_household;
	return zip_code_pop_95050 * opt_in * diversity_constant;
}

/*****************************************************************************
 * SEASONAL FLEET CAPACITY COMPUTATION
 *****************************************************************************/

//Assumes all vehicles in the fleet are the same
/**
 * Calculates the fleets capacity every day
 * @param {*} opt_in (vehicle percentage, ie 0.5 == 50% opt-in of EV's in fleet)
 * @param {*} totalSeasons
 * @param {*} seasonPF
 * @param {*} PfPerSeason
 * @return - A fleet with an overall decaying battery in an array
 */
function get_fltCap_per_season(totalSeasons, seasonPF, CfPerSeason) {
	const factory_new_flt_cap = get_veh_pop() * (1 - msoc) * battery_capacity; // no battery degredation
	const batt_degrad_factor = Math.min(CfPerSeason, seasonPF) / 100;
	const batt_degrad_amount = factory_new_flt_cap * batt_degrad_factor;
	let fltCapPerYear = [];
	for(let i = 0; i < totalSeasons; ++i) {
		fltCapPerYear.push(factory_new_flt_cap - (i * batt_degrad_amount));
	}
	return fltCapPerYear;
}


// Return an array of the daily decremented values that got the capacity from the <startCap> to <endCap>
function get_daily_capacity_decrements_from_beginning_to_end_of_season_capacities(startCap, endCap, daysInSeason) {
	const daily_decrease = (startCap - endCap) / daysInSeason;
	let season_day_caps = [];
	for(let i = 0; i <= daysInSeason; ++i)
		season_day_caps.push(startCap - (daily_decrease * i));
	return season_day_caps;
}


// Return an array of the fleet cpacity for every day of each season with <opt_in> vehicle opt-in values
function get_season_fltCap_per_day(getFltCapPerSeason, getDailyCapacityDecrements) {
	const totalSeasons = get_total_years();
	const fltCap_per_season = getFltCapPerSeason(opt_in,totalSeasons+1);
	let fltCap_per_day_per_season = [];
	for(let i = 0; i < fltCap_per_season.length - 1; ++i) {
		fltCap_per_day_per_season.push(
			...getDailyCapacityDecrements(fltCap_per_season[i],fltCap_per_season[i+1])
		);
	}
	return fltCap_per_day_per_season;
}

/*****************************************************************************
 * SUMMER FLEET CAPACITY COMPUTATION
 *****************************************************************************/

function get_fltCap_per_summer(totalSummers) {
	return get_fltCap_per_season(totalSummers, PF_per_summer, CF_per_summer)
}


function get_daily_capacity_decrements_from_beginning_to_end_of_summer_capacities(startCap, endCap) {
	const days_in_summer = 30 + 31 + 31 + 30; // June, July, Aug, Sept
	return get_daily_capacity_decrements_from_beginning_to_end_of_season_capacities(startCap, endCap, days_in_summer);
}


function get_summer_fltCap_per_day() {
	return get_season_fltCap_per_day(get_fltCap_per_summer, get_daily_capacity_decrements_from_beginning_to_end_of_summer_capacities);
}

/*****************************************************************************
 * WINTER FLEET CAPACITY COMPUTATION
 *****************************************************************************/

function get_fltCap_per_winter(totalWinters) {
	return get_fltCap_per_season(totalWinters, PF_per_winter, CF_per_winter);
}


function get_daily_capacity_decrements_from_beginning_to_end_of_winter_capacities(startCap, endCap) {
	const days_in_winter = 31 + 30 + 31 + 31; // Oct, Nov, Dec, Jan
	return get_daily_capacity_decrements_from_beginning_to_end_of_season_capacities(startCap, endCap, days_in_winter);
}


function get_winter_fltCap_per_day() {
	return get_season_fltCap_per_day(get_fltCap_per_winter, get_daily_capacity_decrements_from_beginning_to_end_of_winter_capacities);
}

/*****************************************************************************
 * REVENUE COMPUTATION HELPER FUNCTION
 *****************************************************************************/

/**
 * Converts military time to minutes since 0000
 * @param {*} mil_time - military time
 */
function mil_time_to_minutes(mil_time) {
	const hours = mil_time / 100;
	const minutes = mil_time % 100;
	return (minutes + hours * 60);
}

/*****************************************************************************
 * SUMMER REVENUE COMPUTATION
 *****************************************************************************/

/**
 * Calculates the money saved using PGE's TOU-D plan over one day
 * @param {*} division_of_time - For example: hourly inputs would be 60
 */
const get_summer_revenue_pge_tou_FOR_1_DAY = (() => {
	const division_of_time = 15;

	//create subarray of percent_flt_avail within the range of peak hours
	const start_index = mil_time_to_minutes(PGE_TOU_D.summer_peak_start) / division_of_time;
	const end_index   = mil_time_to_minutes(PGE_TOU_D.summer_peak_end) / division_of_time;
	const peak_avail  = percent_flt_avail.slice(start_index, end_index);

	//All vehicles that can will participate in this V2G event. Thus the highest availability
	//over the peak hours is used to determine how much energy is discharged
	const summer_peak_difference = PGE_TOU_D.summer_peak - PGE_TOU_D.summer_off_peak;
	const summer_peak_availability_factor = Math.max(...peak_avail)/100;

	// By using a closure, we only have to compute constant values once, then capture them!
	// Note that this closure is assigned as <get_summer_revenue_pge_tou_FOR_1_DAY>'s value.
	return (flt_cap_of_current_day) => {
		const discharged_energy = summer_peak_availability_factor * flt_cap_of_current_day;
		return discharged_energy * summer_peak_difference; // revenue
	};
})();


function get_summer_revenue_pge_tou() {
	const flt_cap_per_day = get_summer_fltCap_per_day(); // array of flt_cap for every day from june->sept
	let revenue = 0;
	for(let flt_cap of flt_cap_per_day)
		revenue += get_summer_revenue_pge_tou_FOR_1_DAY(flt_cap);
	return revenue;
}

/*****************************************************************************
 * WINTER REVENUE COMPUTATION
 *****************************************************************************/

/**
 * Calculates the money saved using PGE's TOU-D plan over one day
 * @param {*} division_of_time - For example: hourly inputs would be 60
 */
const get_winter_revenue_pge_tou_FOR_1_DAY = (() => {
	const division_of_time = 15;

	//create subarray of percent_flt_avail within the range of peak hours
	const start_index = mil_time_to_minutes(PGE_TOU_D.winter_peak_start) / division_of_time;
	const end_index   = mil_time_to_minutes(PGE_TOU_D.winter_peak_end) / division_of_time;
	const peak_avail  = percent_flt_avail.slice(start_index, end_index);

	//All vehicles that can will participate in this V2G event. Thus the highest availability
	//over the peak hours is used to determine how much energy is discharged
	const winter_peak_difference = PGE_TOU_D.winter_peak - PGE_TOU_D.winter_off_peak;
	const winter_peak_availability_factor = Math.max(...peak_avail)/100;

	// By using a closure, we only have to compute constant values once, then capture them!
	// Note that this closure is assigned as <get_winter_revenue_pge_tou_FOR_1_DAY>'s value.
	return (flt_cap_of_current_day) => {
		const discharged_energy = winter_peak_availability_factor * flt_cap_of_current_day;
		return discharged_energy * winter_peak_difference; // revenue
	};
})();


//TO DO exclude holidays
function get_winter_revenue_pge_tou() {
	const flt_cap_per_day = get_winter_fltCap_per_day(); // array of flt_cap for every day from june->sept
	let revenue = 0;
	for(let flt_cap of flt_cap_per_day)
		revenue += get_winter_revenue_pge_tou_FOR_1_DAY(flt_cap);
	return revenue;
}

/*****************************************************************************
 * SUMMER REVENUE/PROFIT/SUBSIDIES MATH
 *****************************************************************************/

const SUMMER_INDIV_COST_OF_BATTERY_DEGREDATION = convert_CF_to_cost(CF_per_summer); // USD, found by Chris


function netSummerRevenueOfOneVehicle(totalSummers) {
	const fleetRevenue = get_summer_revenue_pge_tou(totalSummers);
	const totalCarsInFleet = get_veh_pop();
	return fleetRevenue / totalCarsInFleet;
}


// Note: THIS DOES NOT ACCOUNT FOR REPLACEMENT OF BATTERIES AFTER SOME NUMBER OF SUMMERS
function netSummerProfitOfOneVehicle() {
	const totalSummers = get_total_years();
	return netSummerRevenueOfOneVehicle(totalSummers) - SUMMER_INDIV_COST_OF_BATTERY_DEGREDATION * totalSummers;
}


function getFleetProfit() {
	return netSummerProfitOfOneVehicle() * get_veh_pop();
}

/*****************************************************************************
 * WINTER REVENUE/PROFIT/SUBSIDIES MATH
 *****************************************************************************/

const WINTER_INDIV_COST_OF_BATTERY_DEGREDATION = convert_CF_to_cost(CF_per_winter); // USD, found by Chris


function netWinterRevenueOfOneVehicle(totalWinters) {
	const fleetRevenue = get_winter_revenue_pge_tou(totalWinters);
	const totalCarsInFleet = get_veh_pop();
	return fleetRevenue / totalCarsInFleet;
}


// Note: THIS DOES NOT ACCOUNT FOR REPLACEMENT OF BATTERIES AFTER SOME NUMBER OF SUMMERS
function netWinterProfitOfOneVehicle() {
	const totalWinters = get_total_years();
	return netWinterRevenueOfOneVehicle(totalWinters) - WINTER_INDIV_COST_OF_BATTERY_DEGREDATION * totalWinters;
}


function getWinterFleetProfit() {
	return netWinterProfitOfOneVehicle() * get_veh_pop();
}

/*****************************************************************************
 * CALCULATION UPDATES
 *****************************************************************************/

// Determine the number of vehicles in the fleet
function calc_veh_pop() {
	veh_pop = get_veh_pop();
}


// Update flt_cap for the Nth year (Nth year determined by <get_total_years()>)
// Note that <get_fltCap_per_summer> returns an array of fleet capacities for N years (where N is its parameter)
function calc_flt_cap() {
	const totalYears = get_total_years();
	flt_cap = get_fltCap_per_summer(totalYears)[totalYears-1] + get_fltCap_per_winter(totalYears)[totalYears-1];
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
/*
function mil_time_to_minutes(mil_time) {
	var hours = mil_time / 100;
	var minutes = mil_time % 100;
	return (minutes + hours * 60);
}
*/
/*****************************************************************************
 * JQUERY ZIP UPDATES
 *****************************************************************************/

//Retrieve zip code from map
$("#zip").change(function(){
	zip_code = $("#zip").val();

	calc_veh_pop();
	calc_flt_cap();
	flt_tou_profit[0].revenue = get_winter_revenue_pge_tou();
	flt_tou_profit[1].revenue = get_summer_revenue_pge_tou();
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

/*****************************************************************************
 * GRAPH UPDATES
 *****************************************************************************/

// When multiple choice is changed, update graphs. This function is called in app.js
function updateGraphs(){

	//msoc = $("#msocText").val()/100; //is a percentage;
	opt_in = $("#optinText").val()/100;

	// Get id of selected vehicle
	//vehicle_type = $("#car-list .selected").attr("id");
	//console.log(vehicle_type);

	//console.log(data.batteryKWhCapacity);
	//battery_capacity = $("#car-list .selected div h6").attr("property");

	calc_veh_pop();
	calc_flt_cap();
	console.log(flt_tou_profit);

	flt_tou_profit[0].revenue = get_winter_revenue_pge_tou();
	flt_tou_profit[1].revenue = get_summer_revenue_pge_tou();
	flt_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue, flt_tou_profit[1].revenue,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));
	indiv_profit = Math.round(calc_annual_profit(flt_tou_profit[0].revenue/veh_pop, flt_tou_profit[1].revenue/veh_pop,
		PGE_TOU_D.winter_length, PGE_TOU_D.summer_length));

	// Set the value of the HTML spans to a smaller number, expressed in larger units (e.g. Gigawatts vs Kilowatts)
	let flt_val = battery_capacity * veh_pop;



	return {"fleet": flt_profit, "indiv": indiv_profit, "cap": flt_val};
	//updatePS();
}