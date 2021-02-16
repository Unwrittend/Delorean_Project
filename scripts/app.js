// Project DeLorean
// JavaScript Document

// The population and MSOC inputs require constant factors so the sliders work properly
// Sliders go from 1-100. Factors make it easier to manage the maximum and minimum values
var popConstant = 1000;
var msocConstant = 100;

$(function() {
});

// Toggle green background for the currently selected MC option
$(".option").click(function (){
	$(".option").removeClass("selected");
	$(this).addClass("selected");
});
