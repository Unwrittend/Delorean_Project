// JQuery Document

// Populate the multi-select with user-specified cars.
function populateCars() {

	// Empty the container before populating it
	$("#car-list").empty();
	let mc_value = $("#car-make").val() + "";

	$.ajax({
		type: "GET",
		url: "/populateCars",
		data: {make: mc_value},
		contentType: "String",

		success: function(data){

			// Now that we have the data, create selection options for each
			$.each(data, function(i, car){

				let carId = car._id;
				let carModel = car.model;

				// For boilerplate div, see index.ejs
				$("#car-list").append("<div id=\"" +carId +"\" class=\"option\"></div>");

				$("#" +carId).append("<img src=\"images/" +carId +".png\" alt=\"" +mc_value + " " +carModel +" image\" class=\"img-thumbnail\" />");

				$("#" +carId).append("<h4>" +mc_value + " " +carModel +"</h4>");

				$(document).on("click", ".option", toggleMCSelected);
			});
		},
		error: function(err){
			console.log(err.body);
			$("#car-list").append("<p>:( An AJAX error occurred. Please try reloading the page or contacting the administrators.</p>");
		}
	});
	/*for(var i=1; i<=length; i++){
		var content = fieldName +" " +i;
		var nameId = fieldName +i;
		var addfield = "<div class=\"multi-select-element\"><input id=\"" +nameId +"\" name=\"" +nameId +"\" type=\"checkbox\"/> <label class=\"multi-label multi-label-full\" for=\"" +nameId +"\">" +content +"</label></div>";
		$(target).append(addfield);
	}*/
}