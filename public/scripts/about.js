// JQuery Document
// This document contains scripts for the page about.ejs, which has the contact form

function submitForm(e) {
	// Remove success/error messages
	$(".err").remove();

	e.preventDefault();

	// If the captcha was filled out, send e-mail
	if( $("#g-recaptcha-response").val() ){
		$("#mail-spinner").show(100);
		sendEmail();
	}
	// Otherwise, print an error message
	else {
		$("#email-form").append("<p class=\"err text-danger\">Captcha must be selected</p>");
	}
}

function sendEmail() {

	$.ajax({
		type: "GET",
		url: "/sendmail",
		data: {
			name: $("#name").val(),
			email: $("#email").val(),
			subject: $("#subject").val(),
			body: $("#body").val(),
			captcha: $("#g-recaptcha-response").val()
		},
		contentType: "String",

		success: function(data){

			$("#mail-spinner").hide(100);

			if(data.status === "success") {
				$("#email-form").append("<p class=\"err text-success\">" +data.msg +"</p>");
			}
			else {
				$("#email-form").append("<p class=\"err text-danger\">" +data.msg +"</p>");
			}
		},

		// Provide a descriptive error message
		error: function(err){
			$("#mail-spinner").hide(100);

			$("#email-form").append("<p class=\"err\">:( A server error occurred. Please try reloading the page or contacting the administrators.</p>");
		}
	});
}

// When page loads
$(function() {
	$("#email-form").on("submit", submitForm);
	$("#mail-spinner").hide();
});