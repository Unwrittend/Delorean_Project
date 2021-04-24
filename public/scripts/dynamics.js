// JQuery Document

// Populate the multi-select with user-specified cars. Triggered when the dropdown for manufacturer is changed
function populateCars() {

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
				// For boilerplate div, see index.ejs
				$("#car-list").append("<div id=\"" +carId +"\" class=\"option\"></div>");

				$("#" +carId).append("<img src=\"images/vehicles/" +carId +".png\" alt=\"image\" class=\"img-thumbnail\" />");

				$("#" +carId).append("<div><h4>" +mc_value + " " +carModel +"</h4><h6 property=\"" +carBattery +"\">Battery: " +carBattery +" kWh</h6></div>");
			});

			// Attach click event handler to the newly created elements
			$(document).on("click", ".option", toggleMCSelected);

			$("#car-spinner").hide(100);
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