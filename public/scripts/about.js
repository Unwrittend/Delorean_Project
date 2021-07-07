// JQuery Document
// This document contains scripts for the page about.ejs, which has the contact form

function submitForm(e) {
	// Remove success/error messages
	$(".err").remove();

	$("#mail-spinner").show(100);

	e.preventDefault();
	runCaptcha();
}

function runCaptcha() {

	grecaptcha.execute("6Leb3XgbAAAAAA2hlm6qpV2dbGXZS_wh3BZ62OOY", {action: "submit"}).then(function(token) {
		sendEmail(token);
	}).catch(err => {alert("Error!")});
}

function sendEmail(captcha) {
	//const info = JSON.stringify({name:$("#name").val(), email:$("#email").val(), subject:$("#subject").val(), body:$("#body").val(), captcha:captcha});

	$.ajax({
		type: "GET",
		url: "/sendmail",
		data: {
			name: $("#name").val(),
			email: $("#email").val(),
			subject: $("#subject").val(),
			body: $("#body").val(),
			captcha: captcha
		},
		contentType: "String",

		success: function(data){

			// We call this line in both the success callback and the error callback so there are no duplicate messages


			$("#mail-spinner").hide(100);
			//alert("E-mail has been sent");
			//console.log(data);
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
			console.log(err.body);

			// We call this line in both the success callback and the error callback so there are no duplicate messages

			$("#email-form").append("<p class=\"err\">:( A server error occurred. Please try reloading the page or contacting the administrators.</p>");
		}
	});
}

// When page loads
$(function() {
	$("#email-form").on("submit", submitForm);
	$("#mail-spinner").hide();
});