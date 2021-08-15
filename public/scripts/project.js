// Project DeLorean
// JQuery Document

// This document contains all functions and variables for the main project form

let widget_width = $(".form-result").css("width");
widget_width = widget_width.substr(0, widget_width.length - 2);
widget_width = parseInt(widget_width, 10);
widget_width -= 50;

let sel_i=0;

// Toggle green background for the currently selected view option (individual/organization)
$(".view-toggle button").click(function (){
	$(".view-toggle button").removeClass("selected");
	$(this).addClass("selected");
});

// Multiple choice select -- also add to the "cart" of cars
function toggleMCSelected() {
	// Name of the car the user just selected
	let carName = $(this).children("div").children("h4").html();

	// If the car is not already selected, execute this code
	if( JSON.parse(Cookies.get("cars")).filter(e => e.name === carName).length === 0 ) {

		// Make the multiple choice option green
		$(this).addClass("selected");

		// Add the markup to show this in the cart
		$("#cars-selected").append(
			"<div id=\"car-sel-" +sel_i +"\" class=\"car-select\">\n" +
			"    <div class=\"car-labels-L\">\n" +
			"        <div>"+
			"            <h5>" +carName +"</h5>\n" +
			"            <button id=\"rm-" +sel_i +"\" class=\"btn btn-danger remove-car\" onClick='removeCar($(\"#rm-" +sel_i +"\"))'>Remove</button>\n" +
			"        </div>"+
			"    </div>\n" +
			"    <div class=\"car-sliders\">\n" +
			"        <div class=\"d-flex justify-content-center\">\n" +
			"            <input type=\"number\" id=\"car-sel-txt-" +sel_i +"\" class=\"form-control input-text\" value=\"100\" min=\"0\" max=\"100\" oninput=\"bindInputs($(this), $('#car-sel-rng-" +sel_i +"'))\" />\n" +
			"        </div>\n" +
			"        <input type=\"range\" id=\"car-sel-rng-" +sel_i +"\" class=\"form-control slider\" value=\"100\" min=\"0\" max=\"100\" oninput=\"bindInputs($(this), $('#car-sel-txt-" +sel_i +"'))\" />\n" +
			"    </div>\n" +
			"</div>"
		);

		// Increment the iterator (TODO: is this necessary?)
		sel_i++;

		// Attach click event handler to the newly created elements
		$(document).on("click", ".remove-car", removeCar);

		// Add the new car to the cookie
		let cars = JSON.parse(Cookies.get("cars"));
		cars.push({
			name: carName,				// Model and make of the car
			id: $(this).attr("id"),		// alphanumeric string in mongodb
			cap: $(this).children(".car-labels").children("h6").attr("property") // Car's battery capacity
		});
		Cookies.set("cars", JSON.stringify(cars));

		//validateAndUpdate();
	}

}

// Remove a car from the list
function removeCar(el) {
	let rm_i = el.attr("id").substr(3);
	let cars = JSON.parse(Cookies.get("cars"));
	let rm_id = cars[rm_i].id;

	cars.splice(rm_i, 1);
	Cookies.set("cars", JSON.stringify(cars));

	$("#car-sel-" +rm_i).remove();
	$("#" +rm_id).removeClass("selected");
}

// Next 2 functions are for the view toggle
function switchToIndiv() {
	$("#optin-panel").addClass("d-none");
	$("#hours-panel").removeClass("d-none");
	$("#flt-roi").addClass("d-none");
	$("#indiv-roi").removeClass("d-none");
	$("#kwh-panel").addClass("d-none");
	Cookies.set("view", "individual");
}

function switchToOrg() {
	$("#optin-panel").removeClass("d-none");
	$("#hours-panel").addClass("d-none");
	$("#flt-roi").removeClass("d-none");
	$("#indiv-roi").addClass("d-none");
	$("#kwh-panel").removeClass("d-none");
	Cookies.set("view", "organizer");
}

/***************** Populate the multi-select with user-specified cars.
 * Triggered when the dropdown for manufacturer is changed  ********************/
function populateCars(callback) {

	// Empty the container before populating it
	$("#car-list").empty();

	let mc_value = $("#car-make").val() + "";

	if(mc_value == "default") {
		return;
	}

	// Show the loading spinner
	$("#car-spinner").show(100);

	$.ajax({
		type: "GET",
		url: "/getCarsByMake",
		data: {make: mc_value},
		contentType: "String",

		success: function(data){

			// We call this line in both the success callback and the error callback so there are no duplicate messages
			$(".err").remove();

			// Now that we have the data, create selection options for each
			$.each(data, function(i, car){

				let carId = car._id;
				let carModel = car.model;
				let carBattery = car.batteryKWhCapacity;

				// For boilerplate selection, see index.ejs

				// If the car is not selected, render it normally
				if( JSON.parse(Cookies.get("cars")).filter(e => e.name === `${mc_value} ${carModel}`).length === 0 )
					$("#car-list").append("<div id=\"" +carId +"\" class=\"option\"></div>");

				// If the car is already selected, add the "selected" class
				else
					$("#car-list").append("<div id=\"" +carId +"\" class=\"option selected\"></div>");

				// The div's contents are common code
				$("#" +carId).append(
					"<img src=\"images/vehicles/" +carId +".png\" alt=\"image\" class=\"img-thumbnail\" />" +
					"<div class=\"car-labels\"><h4>" +mc_value + " " +carModel +"</h4><h6 property=\"" +carBattery +"\">Battery size: " +carBattery +" kWh</h6></div>"
				);

			});

			// Attach click event handler to the newly created elements
			$(document).on("click", ".option", toggleMCSelected);

			$("#car-spinner").hide(100);

			typeof callback === "function" && callback();
		},

		// Provide a descriptive error message
		error: function(err){
			$("#car-spinner").hide(100);
			console.log(err.body);

			// We call this line in both the success callback and the error callback so there are no duplicate messages
			$(".err").remove();
			$("#car-list").append("<p class=\"err\">:( A server error occurred. Please try reloading the page or contacting the administrators.</p>");
		}
	});
}

/***************** Populate the cart with the selected cars  ********************/
function populateSelectedCars() {
	JSON.parse(Cookies.get("cars")).forEach( function(item){
		$("#cars-selected").append(
			"<div id=\"car-sel-" +sel_i +"\" class=\"car-select\">\n" +
			"    <div class=\"car-labels-L\">\n" +
			"        <div>"+
			"            <h5>" +item.name +"</h5>\n" +
			"            <button id=\"rm-" +sel_i +"\" class=\"btn btn-danger remove-car\" onClick='removeCar($(\"#rm-" +sel_i +"\"))'>Remove</button>\n" +
			"        </div>"+
			"    </div>\n" +
			"    <div class=\"car-sliders\">\n" +
			"        <div class=\"d-flex justify-content-center\">\n" +
			"            <input type=\"number\" id=\"car-sel-txt-" +sel_i +"\" class=\"form-control input-text\" value=\"100\" min=\"0\" max=\"100\" oninput=\"bindInputs($(this), $('#car-sel-rng-" +sel_i +"'))\" />\n" +
			"        </div>\n" +
			"        <input type=\"range\" id=\"car-sel-rng-" +sel_i +"\" class=\"form-control slider\" value=\"100\" min=\"0\" max=\"100\" oninput=\"bindInputs($(this), $('#car-sel-txt-" +sel_i +"'))\" />\n" +
			"    </div>\n" +
			"</div>"
		);
		sel_i++;
	} );
}

/*
// Find the selected car (using cookies) and show it in the multiple-choice
function findCar() {
	let make = Cookies.get("make");
	let sel_make = $("#car-make");

	// Do not make an AJAX call if the user has not selected a car, or if they have not navigated away
	// from the currently selected one.
	if(make && make !== sel_make.val()){
		sel_make.val(make);
		populateCars(function() {
			$(".option").removeClass("selected");
			$("#" +Cookies.get("model")).addClass("selected");
			validateAndUpdate();
		});
	}
}
*/

/*****************  Bind sliders and text fields  ********************/
function bindInputs(source, dest) {
	dest.val(source.val());
	validateAndUpdate();
}

/***************** Setup for the jQuery UI Slider ********************
const slider = $("#slider");
const hours1 = $("#hours-1");
const hours2 = $("#hours-2");
let hrs1, hrs2;
let h_inp1, h_inp2;
let mins1, mins2;
let msg;

slider.slider({
	min: 0,
	max: 24,
	range: true,
	values: [ 9, 17 ],

	// Set the time field input when the sliders change
	slide: function(event, ui) {
		hrs1 = ui.values[0];
		hrs2 = ui.values[1];

		if (hrs1 === 24) {
			hours1.val( "23:59" );
		} else if (hrs1 >= 10) {
			hours1.val( hrs1 + ":00" );
		} else {
			hours1.val( "0" + hrs1 + ":00" );
		}

		if (hrs2 === 24) {
			hours2.val( "23:59" );
		} else if (hrs2 >= 10) {
			hours2.val( hrs2 + ":00" );
		} else {
			hours2.val( "0" + hrs2 + ":00" );
		}
	}
});

// Change the slider values when the time fields are changed
hours1.change(function(){
	h_inp1 = hours1.val(); // String in 24-hr time format
	h_inp2 = hours2.val(); // String in 24-hr time format
	hrs1 = parseInt(h_inp1.substring(0, 2));	// Number containing hour
	mins1 = parseInt(h_inp1.substring(3, 5));	// Number containing minutes

	// Form validation. If invalid input is given, run the error handler
	if(hrs1 >= parseInt(h_inp2.substring(0, 2)) ) {
		msg = "Please select a valid time";
		throwError(this, msg);
	}
	else {
		// If input is valid, remove any error styles if they were displayed
		clearError(this);

		if (mins1 > 30) {
			slider.slider("values", 0, (hrs1 + 1).toString());
		} else {
			slider.slider("values", 0, (hrs1).toString());
		}
	}

});

hours2.change(function(){
	h_inp1 = hours1.val(); // String in 24-hr time format
	h_inp2 = hours2.val(); // String in 24-hr time format
	hrs2 = parseInt(h_inp2.substring(0, 2)); 	// Number containing hour
	mins2 = parseInt(h_inp2.substring(3, 5)); 	// Number containing minutes

	// Form validation. If invalid input is given, run the error handler
	if(hrs2 <= parseInt(h_inp1.substring(0, 2)) ) {
		msg = "Please select a valid time";
		throwError(this, msg);
	}
	else{
		// If input is valid, remove the error styles if they were displayed
		clearError(this);

		if(mins2 > 30) {
			slider.slider( "values", 1, (hrs2+1).toString() );
		}
		else {
			slider.slider("values", 1, (hrs2).toString());
		}
	}
});
*/
/*********************  Graph Types/Format  *****************************/
// Update Fleet Availability graph when the graph type is changed.
let useFuture = false;
/*
$("#graphType").change(function () {
	// If we do not want to show the future graph:
	if (useFuture) {
		useFuture = false;
	}
	// If we do want to overlay the future graph:
	else {
		useFuture = true;
	}

	updateFA();
});
*/
/***********************  Stuff to run on window resize  *******************************/
$(window).resize(function(){
	// Update graph width
	widget_width = $(".form-result").css("width");
	widget_width = widget_width.substr(0, widget_width.length - 2);
	widget_width = parseInt(widget_width, 10);
	widget_width -= 50;

	//validateAndUpdate();
	if($("#car-list .selected").length)
		updatePS();
	updateFA();
	updateBrand();
});

/********************************  Validation  ***************************************/
function validateAndUpdate() {
	clearError();

	let valid = true;
	let msoc = $("#msocText");

	/**  Common Stuff  **/
	// If no car is selected
	if( JSON.parse(Cookies.get("cars")).length === 0 ) {
		valid = false;
		throwError($("#car-make"), "Please select a car");
	}

	// If MSOC text box value is out of range
	if( parseInt(msoc.val()) > parseInt(msoc.attr("max")) || parseInt(msoc.val()) < parseInt(msoc.attr("min")) ) {
		valid = false;
		throwError(msoc, "Invalid input");
	}

	// If in organizer view:
	if(Cookies.get("view") === "organizer") {
		let optin = $("#optinText");

		// If opt-in text box is out of range
		if( parseInt(optin.val()) > parseInt(optin.attr("max")) || parseInt(optin.val()) < parseInt(optin.attr("min")) ) {
			valid = false;
			throwError(optin, "Invalid input");
		}
	}
	// If in individual view:
	else if(Cookies.get("view") === "individual") {}

	// At this point, check if we can update the graphs
	if(valid) {
		runCalculations();
		updatePS();
	}
	else {
		//console.log("Failed."); Dev Only
	}
}

/********************************  Set variable values and update graphs  ***************************************/
function runCalculations() {

	let total_fleet = 0;
	let total_indiv = 0;
	let total_energy = 0;
	let results;

	let cars = JSON.parse(Cookies.get("cars")); // Array of all the cars

	// Update variables in fleet-capcity.js (line 50)
	msoc = $("#msocText").val() / 100;

	for(let i=0; i<cars.length; i++) {
		battery_capacity = cars[i].cap;
		diversity_constant = $("car-sel-txt-" +i) / 100;

		results = updateGraphs();
		total_fleet += results.fleet;
		total_indiv += results.indiv;
		total_energy += results.cap;
	}

	// Set the value of the HTML spans to a smaller number, expressed in larger units (e.g. Gigawatts vs Kilowatts)
	let unit = "kWh";

	// Once for Megawatts
	if(total_energy >= 1000) {
		total_energy /= 1000;
		unit = "MWh";
	}
	// Again for Gigawatts
	if(total_energy >= 1000) {
		total_energy /= 1000;
		unit = "GWh";

		// Easter Egg -- if fleet capacity is approximately 1.21 GWh, replace unit with "Jigawatt-hours"
		if(total_energy >= 1.21 && total_energy < 1.22)
			unit = "Jigawatt-hours";
	}

	// Populate spans in HTML with the values, separated with commas (e.g. 1,000,000)
	flt_roi_field.text(total_fleet.toLocaleString());
	indiv_roi_field.text(total_indiv.toLocaleString());
	flt_cap_field.text((total_energy).toLocaleString() + " " +unit);

	flt_tou_profit = total_fleet

}


/********************************  On Page load  ***************************************/
$(function() {
	if(Cookies.get("view") === "individual")
		switchToIndiv();

	if(!Cookies.get("cars"))
		Cookies.set("cars", "[]");

	// Hide loading spinners and reset the car multiple choice field
	$(".spinner-wrapper").hide();
	$("#car-make").val("default");

	// Set the future-graph toggle to false
	$("#graphType").prop("checked", false);
	updateFA();

	populateSelectedCars();

	// Set default times
	//hours1.val( "0" + slider.slider( "values", 0 ) + ":00" );
	//hours2.val( slider.slider( "values", 1 ) + ":00" );
})