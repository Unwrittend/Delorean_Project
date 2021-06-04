// Project DeLorean
// JavaScript Document

// This document contains basic functions for the website homepage.
let isSmall;

function changeHeader() {
	let scroll = $(window).scrollTop();
	if(scroll > 580) {
		$("nav.navbar").removeClass("justify-content-center header-expanded");
	}
	else {
		$("nav.navbar").addClass("justify-content-center header-expanded");
	}
}

$(window).scroll(function() {
	if(!isSmall) {
		changeHeader();
	}
});

$(window).resize(function() {
	if( $(window).width() <= 767 ){
		isSmall = true;
		$("nav.navbar").removeClass("justify-content-center header-expanded");
	}
	else {
		isSmall = false;
		changeHeader();
	}
	updateBrand();
});

$(function() {
	if( $(window).width() <= 767 ){
		isSmall = true;
		$("nav.navbar").removeClass("justify-content-center header-expanded");
		updateBrand();
	}
	else {
		isSmall = false;
		changeHeader();
	}
})