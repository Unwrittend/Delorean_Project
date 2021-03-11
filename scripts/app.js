// Project DeLorean
// JavaScript Document

// This document contains basic functions for the website's interactive elements.

// The population and MSOC inputs require constant factors so the sliders work properly
// Sliders go from 1-100. Factors make it easier to manage the maximum and minimum values
var popConstant = 1000;

var widget_width = $(".form-result").css("width");
widget_width = widget_width.substr(0, widget_width.length - 2);
widget_width = parseInt(widget_width, 10);
widget_width -= 50;

$(function() {
});

// Toggle green background for the currently selected view option (individual/organization)
$(".view-toggle button").click(function (){
	$(".view-toggle button").removeClass("selected");
	$(this).addClass("selected");
});

// Toggle green background for the currently selected MC option
$(".option").click(function (){
	$(".option").removeClass("selected");
	$(this).addClass("selected");
});

// Next 2 functions are for the mode toggle
function switchToIndiv() {
	$("#optin-panel").addClass("d-none");
	$("#hours-panel").removeClass("d-none");
	$("#flt-roi").addClass("d-none");
	$("#indiv-roi").removeClass("d-none");
	$("#kwh-panel").addClass("d-none");
}

function switchToOrg() {
	$("#optin-panel").removeClass("d-none");
	$("#hours-panel").addClass("d-none");
	$("#flt-roi").removeClass("d-none");
	$("#indiv-roi").addClass("d-none");
	$("#kwh-panel").removeClass("d-none");
}

function listCars(make) {

}

// Setup for the jQuery UI Slider
const slider = $("#slider");
const hours1 = $("#hours-1");
const hours2 = $("#hours-2");
var hrs1, hrs2;

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

hours1.val( "0" + slider.slider( "values", 0 ) + ":00" );
hours2.val( slider.slider( "values", 1 ) + ":00" );

/* Change the slider values when the time fields are changed */
hours1.change(function(){
	slider.slider( "values", 0, hours1.val().substring(0, 1) );
});

hours2.change(function(){
	slider.slider( "values", 1, hours2.val().substring(0, 1) );
});

var useFuture = false;
$("#graphType").change(function () {
	if (useFuture) {
		useFuture = false;
	} else {
		useFuture = true;
	}
	clearGraph();
	updatePS()
	updateFA();
});

// Update graph width when window is resized (prevents horizontal scroll)
$(window).resize(function(){
	widget_width = $(".form-result").css("width");
	widget_width = widget_width.substr(0, widget_width.length - 2);
	widget_width = parseInt(widget_width, 10);
	widget_width -= 50;
	clearGraph();
	updatePS();
	updateFA();
});