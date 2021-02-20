// Project DeLorean
// JavaScript Document

// This document contains basic functions for the website's interactive elements.

// The population and MSOC inputs require constant factors so the sliders work properly
// Sliders go from 1-100. Factors make it easier to manage the maximum and minimum values
var popConstant = 1000;
var msocConstant = 100;

$(function() {
});

// Toggle green background for the currently selected view option (indiv/org)
$(".view-toggle button").click(function (){
	$(".view-toggle button").removeClass("selected");
	$(this).addClass("selected");
});

// Toggle green background for the currently selected MC option
$(".option").click(function (){
	$(".option").removeClass("selected");
	$(this).addClass("selected");
});

function hideOptIn() {
	$("#optin-panel").addClass("d-none");
}

function showOptIn() {
	$("#optin-panel").removeClass("d-none");
}

// Setup for the jQuery UI Slider
var slider = $("#slider");
var hours1 = $("#hours-1");
var hours2 = $("#hours-2");
var hrs1, hrs2;

slider.slider({
	min: 0,
	max: 24,
	range: true,
	values: [ 9, 17 ],

	slide: function(event, ui){
		hrs1 = ui.values[0];
		hrs2 = ui.values[1];

		if (hrs1 === 24) {
			hrs1 = 0;
		} else if (hrs1 >= 10) {
			hours1.val( ui.values[0] + ":00" );
		} else {
			hours1.val( "0" + ui.values[0] + ":00" );
		}

		if (hrs2 === 24) {
			hrs2 = 0;
		} else if (hrs2 >= 10) {
			hours2.val( ui.values[1] + ":00" );
		} else {
			hours2.val( "0" + ui.values[1] + ":00" );
		}
	}
});

hours1.val( "0" + slider.slider( "values", 0 ) + ":00" );
hours2.val( slider.slider( "values", 1 ) + ":00" );

hours1.change(function(){
	slider.slider( "values", 0, hours1.val().substring(0, 1) );
});

hours2.change(function(){
	slider.slider( "values", 1, hours2.val().substring(0, 1) );
});