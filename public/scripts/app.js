// Project DeLorean
// JavaScript Document

// This document contains basic functions for the website's interactive elements.

// The population and MSOC inputs require constant factors so the sliders work properly
// Sliders go from 1-100. Factors make it easier to manage the maximum and minimum values

let widget_width = $(".form-result").css("width");
widget_width = widget_width.substr(0, widget_width.length - 2);
widget_width = parseInt(widget_width, 10);
widget_width -= 50;

let mode = 1;

// Set a red border and print an error message
function throwError(obj, message) {
	let objId = $(obj).attr("id");
	$(obj).addClass("invalid");

	// Check if error message already was printed. If not, print it.
	/*if( $("#" +objId +"Err").length == 0 ) {
		$(obj).after("<p id=\"" + objId + "Err\">" + message + "</p>");
	}*/
	//$(obj).tooltip({trigger: "focus"});
	$(obj).popover({trigger: "manual"});
	$(obj).popover("show");
}

// Clear the error message and border
function clearError(obj) {
	//let objId = $(obj).attr("id");
	$(".invalid").removeClass("invalid");
	//$("#" +objId +"Err").remove();
	//$(obj).popover("hide");
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
	mode = 0;
}

function switchToOrg() {
	$("#optin-panel").removeClass("d-none");
	$("#hours-panel").addClass("d-none");
	$("#flt-roi").removeClass("d-none");
	$("#indiv-roi").addClass("d-none");
	$("#kwh-panel").removeClass("d-none");
	mode = 1;
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

/*********************  Update Graphs  *****************************/

// Update Fleet Availability graph when the graph type is changed.
let useFuture = false;
$("#graphType").change(function () {
	// If we do not want to show the future graph:
	if (useFuture) {
		clearGraph(1);
		useFuture = false;
	}
	// If we do want to overlay the future graph:
	else {
		useFuture = true;
	}

	updateFA();
});

// Update graph width when window is resized (prevents horizontal scroll)
$(window).resize(function(){
	widget_width = $(".form-result").css("width");
	widget_width = widget_width.substr(0, widget_width.length - 2);
	widget_width = parseInt(widget_width, 10);
	widget_width -= 50;
	clearGraph(-1);
	updatePS();
	updateFA();
});

/*********************  Validation  *****************************/
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
	if(mode === 1) {
		let optin = $("#optinText");

		// If opt-in text box is out of range
		if( parseInt(optin.val()) > parseInt(optin.attr("max")) || parseInt(optin.val()) < parseInt(optin.attr("min")) ) {
			valid = false;
			throwError(optin, "Invalid input");
		}
	}
	// If in individual view:
	else if(mode === 0) {}

	// At this point, check if we can update the graphs
	if(valid) {
		console.log("Update!");
	}
	else {
		console.log("Failed.");
	}
}

$(function() {
	$(".spinner-wrapper").hide();
	$("#car-make").val("default");
	updateFA();

	// Set default times
	hours1.val( "0" + slider.slider( "values", 0 ) + ":00" );
	hours2.val( slider.slider( "values", 1 ) + ":00" );
});