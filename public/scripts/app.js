// Project DeLorean
// JavaScript Document

// This document contains basic functions for the website's interactive elements.
// For elements that change on page load, see bottom of this file

let widget_width = $(".form-result").css("width");
widget_width = widget_width.substr(0, widget_width.length - 2);
widget_width = parseInt(widget_width, 10);
widget_width -= 50;

function switchToLight(el) {
	$("link[href=\"sass/style-dark.css\"]").attr("href", "sass/style-light.css");
	$("nav").removeClass("navbar-dark");
	$("nav").addClass("navbar-light");
	$(".style-switch .btn").removeClass("selected");
	$(el).addClass("selected");

	Cookies.set("mode", "light");
	updateBrand();
}

function switchToDark(el) {
	$("link[href=\"sass/style-light.css\"]").attr("href", "sass/style-dark.css");
	$("nav").removeClass("navbar-light");
	$("nav").addClass("navbar-dark");
	$(".style-switch .btn").removeClass("selected");
	$(el).addClass("selected");

	Cookies.set("mode", "dark");
	updateBrand();
}

// Change navigation logo (triggers on various events)
function updateBrand() {
	let name = $("#navbar-brand").attr("src").substring(7);
	if($(window).width() <= 767) {
		name = "images/" + name.substring(0, 5) + "sm";
	}
	else {
		name = "images/" + name.substring(0, 5) + "lg";
	}
	//-- Replace with dark logo if necessary
	if(Cookies.get("mode") === "dark") {
		name += "_dark.png";
	}
	else {
		name += "_light.png"
	}
	$("#navbar-brand").attr("src", name);
}

// Set a red border and print an error message
function throwError(obj, message) {
	$(obj).addClass("invalid");
}

// Clear the error message and border
function clearError() {
	$(".invalid").removeClass("invalid");
}

// Toggle green background for the currently selected view option (individual/organization)
$(".view-toggle button").click(function (){
	$(".view-toggle button").removeClass("selected");
	$(this).addClass("selected");
});

// Toggle green background for the currently selected MC option, and then update the graphs
function toggleMCSelected() {
	$(".option").removeClass("selected");
	$(this).addClass("selected");
	validateAndUpdate();
}

// Next 2 functions are for the mode toggle
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

/*****************  Bind sliders and text fields  ********************/
function bindInputs(source, dest) {
	dest.val(source.val());
	validateAndUpdate();
}

/***************** Setup for the jQuery UI Slider ********************/
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

	/* Set the time field input when the sliders change */
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

/*********************  Graph Types/Format  *****************************/
// Update Fleet Availability graph when the graph type is changed.
let useFuture = false;
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
	if(! $("#car-list .selected").length) {
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
		//console.log("Update!"); Dev Only
		updateGraphs();
	}
	else {
		//console.log("Failed."); Dev Only
	}
}

/*********************  Other stuff to run on page load  *****************************/
$(function() {
	// Initialize cookie if empty
	if( !(Cookies.get("mode")) )
		Cookies.set("mode", "", { expires: 7 });

	if(Cookies.get("view") === "individual")
		switchToIndiv();

	// If the browser cookie only has path, set values to default. If it has values, then update the browser JSON obj
	if(Cookies.get("mode") === "") {
		// Check if user has enabled dark mode on their computer, and change styles accordingly
		if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
			switchToDark($(".style-switch .btn")[1]); // Automatically updates the cookie
		}
	}

	// Hide loading spinners and reset the car multiple choice field
	$(".spinner-wrapper").hide();
	$("#car-make").val("default");

	// Set the future-graph toggle to false
	$("#graphType").prop("checked", false);
	updateFA();

	// Set default times
	hours1.val( "0" + slider.slider( "values", 0 ) + ":00" );
	hours2.val( slider.slider( "values", 1 ) + ":00" );
});