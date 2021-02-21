// NodeJS Document

const DUMMY_DATA = [
	{ id: "d1", value: 10, region: "US" },
	{ id: "d2", value: 11, region: "IN" },
	{ id: "d3", value: 12, region: "CN" },
	{ id: "d4", value: 6, region: "DE" }
];

const MARGIN = {top: 20, right: 5, bottom: 10, left: 20};
const CHART_WIDTH = 600 - MARGIN.right - MARGIN.left;
const CHART_HEIGHT = 400 - MARGIN.top - MARGIN.bottom;

const xScale = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const yScale = d3.scaleLinear().range([CHART_HEIGHT, 0]);

const chartContainer = d3
	.select("svg")
	.attr("width", CHART_WIDTH + MARGIN.right + MARGIN.left)
	.attr("height", CHART_HEIGHT + MARGIN.top + MARGIN.bottom);

xScale.domain(DUMMY_DATA.map((d) => d.region)); // Unique token used to separate data (here, either ID or region can be used)
yScale.domain([ 0, d3.max(DUMMY_DATA, d => d.value) +3 ]) // Determines max height of the graph (we add 3 so there's some padding above the tallest bar)

const chart = chartContainer.append("g"); // Group in SVG for the many bars

chart
	.append("g")
	.call(d3.axisBottom(xScale).tickSizeOuter(0))
	.attr("transform", `translate(${MARGIN.left}, ${CHART_HEIGHT})`)
	.attr("color", "#000");

chart
	.append("g")
	.call(d3.axisLeft(yScale).tickSizeOuter(0))
	.attr("color", "#000")
	.attr("transform", `translate(${MARGIN.left}, 0)`);

/*chart.selectAll(".bar")
	.data(DUMMY_DATA)
	.enter()
	.append("rect")
	.classed("bar", true)
	.attr("width", xScale.bandwidth())
	.attr("height", data => CHART_HEIGHT - yScale(data.value))
	.attr("x", data => xScale(data.region))
	.attr("y", data => yScale(data.value));
*/

const area = d3.area()
	.curve(d3.curveLinear)
	.x(d => xScale(d.region))
	.y0(yScale(0))
	.y1(d => yScale(d.value));

chart
	.append("path")
	.datum(DUMMY_DATA)
	.attr("fill", "steelblue")
	.attr("d", area);

/*chart.selectAll(".label")
	.data(DUMMY_DATA).enter()
	.append("text")
	.text( (data) => data.value )
	.attr("x", data => xScale(data.region) )
	.attr("y", data => yScale(data.value) - 20)
	.attr("text-anchor", "middle")
	.classed("label", true);
*/
const listItems = d3
	.select("#data")
	.select("ul")
	.selectAll("li")
	.data(DUMMY_DATA).enter()
	.append("li");

listItems.append("span").text(data => data.region);

	/*
	.selectAll("p")		// Once data is added, it selects the "p" elements
	.data([1, 2, 3])	// Bind data to the paragraphs
	.enter()			// Return the elements that should be there but are not there
	.append("p")		// Render those missing elements
	.text(dta => dta);	// Set the text of each p to the data bound to it
*/
