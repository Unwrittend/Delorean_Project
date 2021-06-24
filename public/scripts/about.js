$("#email-form").submit(function(e) {
	e.preventDefault();
	$.ajax({
		type: "GET",
		url: "/sendmail",
		data: {
			name: $("#name").text(),
			email: $("#email").text(),
			subject: $("#subject").text(),
			body: $("#body").text()
		},
		contentType: "String",

		success: function(data){

			// We call this line in both the success callback and the error callback so there are no duplicate messages
			$(".err").remove();

			$("#mail-spinner").hide(100);
		},

		// Provide a descriptive error message
		error: function(err){
			$("#car-spinner").hide(100);
			console.log(err.body);

			// We call this line in both the success callback and the error callback so there are no duplicate messages
			$(".err").remove();
			$("#email-form").append("<p class=\"err\">:( A server error occurred. Please try reloading the page or contacting the administrators.</p>");
		}
	});
});

$(function() {
	$("#car-spinner").hide();
});