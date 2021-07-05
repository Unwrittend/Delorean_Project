// JQuery Document
// This document contains scripts for the page about.ejs, which has the contact form

function onSubmit(token) {
	$("#mail-spinner").show(100);
	e.preventDefault();
	$.ajax({
		type: "GET",
		url: "/sendmail",
		data: {
			name: $("#name").val(),
			email: $("#email").val(),
			subject: $("#subject").val(),
			body: $("#body").val()
		},
		contentType: "String",

		success: function(data){

			// We call this line in both the success callback and the error callback so there are no duplicate messages
			$(".err").remove();

			$("#mail-spinner").hide(100);
			alert("E-mail has been sent");
		},

		// Provide a descriptive error message
		error: function(err){
			$("#mail-spinner").hide(100);
			console.log(err.body);

			// We call this line in both the success callback and the error callback so there are no duplicate messages
			$(".err").remove();
			$("#email-form").append("<p class=\"err\">:( A server error occurred. Please try reloading the page or contacting the administrators.</p>");
		}
	});
}

// When page loads
$(function() {
	$("#mail-spinner").hide();
});