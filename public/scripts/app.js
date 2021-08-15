// Project DeLorean
// JavaScript Document

// This document contains basic functions for the website display.
// For elements that change on page load, see bottom of this file

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

/*******************  Update the navigation brand on page resize  **********************/
$(window).resize(function() {
	updateBrand();
});

/*********************  Other stuff to run on page load  *****************************/
$(function() {
	// Initialize cookie if empty
	if( !(Cookies.get("mode")) )
		Cookies.set("mode", "", { expires: 7 });

	// If the browser cookie only has path, set values to default. If it has values, then update the browser JSON obj
	if(Cookies.get("mode") === "") {
		// Check if user has enabled dark mode on their computer, and change styles accordingly
		if(window.matchMedia("(prefers-color-scheme: dark)").matches) {
			switchToDark($(".style-switch .btn")[1]); // Automatically updates the cookie
		}
	}

	// Takes care of swapping logos on small screens
	updateBrand();

	$(".navbar-toggler").click(function() {
		$(".bar").toggleClass("anim");
	});

});