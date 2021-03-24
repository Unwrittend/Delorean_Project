// D3JS Document

function clearGraph() {
	$("#svg-ps").empty();
	$("#svg-fa").empty();
}

/** *************************************************************************** **/
/**                               Peak Shaving                                  **/
/** *************************************************************************** **/
function updatePS() {

	const MARGIN = {top: 20, right: 5, bottom: 40, left: 70};
	const CHART_WIDTH = widget_width - MARGIN.right - MARGIN.left;
	const CHART_HEIGHT = 400 - MARGIN.top - MARGIN.bottom;

	const xScale = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
	const yScale = d3.scaleLinear().range([CHART_HEIGHT, 0]);

	const chartContainer = d3
		.select("#svg-ps")
		.attr("width", CHART_WIDTH + MARGIN.right + MARGIN.left)
		.attr("height", CHART_HEIGHT + MARGIN.top + MARGIN.bottom);

	xScale.domain(flt_tou_profit.map((d) => d.season)); // Unique token used to separate data (here, either ID or region can be used)
	yScale.domain([0, (d3.max(flt_tou_profit, d => d.revenue) + (d3.max(flt_tou_profit, d => d.revenue) / 10)) ]); //  + (d3.max(flt_tou_profit, d => d.revenue) / 10)

	const chart = chartContainer.append("g"); // Group in SVG for the many bars

	// X-axis
	chart
		.append("g")
		.call(d3.axisBottom(xScale).tickSizeOuter(0))
		.attr("transform", `translate(${MARGIN.left}, ${CHART_HEIGHT + 10})`)
		.attr("color", "#000");

	chart
		.append("text")
		.attr("class", "graph-label")
		.attr("transform", `translate(${CHART_WIDTH/2 + 10}, ${CHART_HEIGHT + 50})`)
		.text("Season");

	// Y-axis
	chart
		.append("g")
		.call(d3.axisLeft(yScale).tickSizeOuter(0))
		.attr("color", "#000")
		.attr("transform", `translate(${MARGIN.left}, 10)`);

	chart
		.append("text")
		.classed("graph-label", true)
		.attr("x",0 - (CHART_HEIGHT / 2))
		.attr("y", 15)
		.style("text-anchor", "middle")
		.attr("transform", `rotate(-90)`)
		.text("Money (USD)");

	// Bars
	chart.selectAll(".bar")
		.data(flt_tou_profit)
		.enter()
		.append("rect")
		.classed("bar", true)
		.attr("width", xScale.bandwidth())
		.attr("height", data => CHART_HEIGHT - yScale(data.revenue))
		.attr("x", (data => xScale(data.season) + MARGIN.left))
		.attr("y", data => yScale(data.revenue) + 10);
}

/** *************************************************************************** **/
/**                           Fleet Availability                                **/
/** *************************************************************************** **/

function updateFA() {
	var graphPath;
	if (useFuture) {
		graphPath = "scripts/jordan_parsers/nhts_csv_parsing_data/future_percent_charging_per_15_mins.json"
	} else {
		graphPath = "scripts/jordan_parsers/nhts_csv_parsing_data/present_percent_charging_per_15_mins.json"
	}

	d3.json(graphPath).then(function(data){
		const MARGIN_FA = {top: 20, right: 5, bottom: 40, left: 50};
		const CHART_WIDTH_FA = widget_width - MARGIN_FA.right - MARGIN_FA.left;
		const CHART_HEIGHT_FA = 400 - MARGIN_FA.top - MARGIN_FA.bottom;

		console.log(data);

		/*stuffJson = [];
		for (var i = 0; i < moreStuff.length; i++) {
			stuffJson[i] = {};
			stuffJson[i].id = i;
			stuffJson[i].time = i * 15;
			stuffJson[i].percent = moreStuff[i];
		}
		console.log(stuffJson);*/

		const chartContainer_FA = d3
			.select("#svg-fa")
			.attr("width", CHART_WIDTH_FA + MARGIN_FA.right + MARGIN_FA.left)
			.attr("height", CHART_HEIGHT_FA + MARGIN_FA.top + MARGIN_FA.bottom);


		const xScale_FA = d3.scaleBand().range([0, CHART_WIDTH_FA]).padding(0.1);
		const xScale_Labels = d3.scaleLinear().range([0, CHART_WIDTH_FA]);

		const yScale_FA = d3.scaleLinear().range([CHART_HEIGHT_FA, 0]);

		xScale_FA.domain(data.map((d) => d.time)); // Unique token used to separate data (here, either ID or time can be used)
		xScale_Labels.domain([0, 24]);
		yScale_FA.domain([0, 100]) // Determines max height of the graph (we add 3 so there's some padding above the tallest bar)

		const chart_FA = chartContainer_FA.append("g"); // Group in SVG for the many bars

		// X-axis
		chart_FA
			.append("g")
			.call( d3.axisBottom(xScale_Labels) ) //.ticks(10, "s").tickSizeOuter(0)
			.attr("transform", `translate(${MARGIN_FA.left}, ${CHART_HEIGHT_FA + 10})`)
			.attr("color", "#000");

		chart_FA
			.append("text")
			.classed("graph-label", true)
			.attr("transform", `translate(${CHART_WIDTH_FA/2 + 10}, ${CHART_HEIGHT_FA + 50})`)
			.text("Time (Hrs)");

		// Y-axis
		chart_FA
			.append("g")
			.call(d3.axisLeft(yScale_FA))
			.attr("color", "#000")
			.attr("transform", `translate(${MARGIN_FA.left}, 10)`);

		chart_FA
			.append("text")
			.attr("class", "graph-label")
			.attr("x",0 - (CHART_HEIGHT_FA / 2))
			.attr("y", 15)
			.style("text-anchor", "middle")
			.attr("transform", `rotate(-90)`)
			.text("Percentage of Fleet Available");

		// Path/Graph
		const area_FA = d3.area()
			.curve(d3.curveLinear)
			.x(d => xScale_FA(d.time))
			.y0(yScale_FA(0))
			.y1(d => yScale_FA(d.percentage)); //yScale_FA(d.revenue)

		chart_FA
			.append("path")
			.datum(data)
			.attr("fill", "rgba(57, 181, 74, 0.1)")
			.attr("stroke", "rgba(57, 181, 74, 1.0)")
			.attr("stroke-width", "2")
			.attr("transform", `translate(${MARGIN_FA.left}, 10)`)
			.attr("d", area_FA);
	});

}
