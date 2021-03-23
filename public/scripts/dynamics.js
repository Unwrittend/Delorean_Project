// JQuery Document

function populateMultiSelectChild(fieldName, target, id, subId){

	var targetId = "#" +target;
	$.ajax({
		type: "GET",
		url: "/populateUI",
		success: function(data){
			$.each(data[id], function(i, obj){
				$(targetId).append("<div class=\"multi-select-element\"></div>");
				var objName = obj.name;
				var trimmed = objName.replace(/ /g, "");
				var ind = i+1;

				$(targetId +" div.multi-select-element:nth-of-type(" +ind +")").append("<input id=\"" +trimmed +"\" name=\"" +trimmed +"\" type=\"checkbox\"/> <label class=\"multi-label\" for=\"" +trimmed +"\">" +objName +"</label> <a class=\"dropdown-toggle\" type=\"button\"></a>");

				$(targetId +" div.multi-select-element:nth-of-type(" +ind +")").append("<div name=\"" +subId +"\" class=\"form-control multi-select\"></div>");

				$.each(obj[subId], function(j, subObj){
					trimmed = subObj.replace(/ /g, "");

					$(targetId +" div.multi-select-element:nth-of-type(" +ind +") div.multi-select").append("<input id=\"" +trimmed +"\" type=\"checkbox\"/> <label class=\"multi-label\" for=\"" +trimmed +"\">" +subObj +"</label><br>");
				});

			});
		},
		error: function(err){
			console.log(err);
			$(targetId).append("<p>:( A connection error occurred. Please try reloading the page.</p>");
		}
	});
	/*for(var i=1; i<=length; i++){
		var content = fieldName +" " +i;
		var nameId = fieldName +i;
		var addfield = "<div class=\"multi-select-element\"><input id=\"" +nameId +"\" name=\"" +nameId +"\" type=\"checkbox\"/> <label class=\"multi-label multi-label-full\" for=\"" +nameId +"\">" +content +"</label></div>";
		$(target).append(addfield);
	}*/
}