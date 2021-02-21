// jQuery Document

// Variables for 3 user inputs. Names self-explanatory. MSOC is Minimum State of Charge
var vehicle_type, msoc, opt_in;

// When multiple choice is changed, update variable value
$("#mc .multi-choice .option").click(function(){
	vehicle_type = $("#mc .multi-choice .selected h4").text();
	console.log(vehicle_type);
});

// When MSOC inputs are changed, update variable value
$("#msocText, #msocSlider").change(function(){
	msoc = $("#msocText").val();
	console.log(msoc);
});

// When Opt-in inputs are changed, update variable value
$("#optinText, #optinSlider").change(function(){
	opt_in = $("#optinText").val();
	console.log(opt_in);
});