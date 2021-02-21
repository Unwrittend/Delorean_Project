// NodeJS Document

/*const DUMMY_DATA = [
	{ id: "d1", value: 10, region: "US" },
	{ id: "d2", value: 11, region: "IN" },
	{ id: "d3", value: 12, region: "CN" },
	{ id: "d4", value: 6, region: "DE" }
];*/

function clearGraph() {
	$("#svg-ps").empty();
}

function updateGraph() {
	var DUMMY_DATA = [
		{season: "Winter", revenue: 11000, id: 1},
		{season: "Summer", revenue: 2300, id: 2}
	];

	console.log(flt_tou_profit);

	DUMMY_DATA = flt_tou_profit;

	const MARGIN = {top: 20, right: 5, bottom: 10, left: 40};
	const CHART_WIDTH = 600 - MARGIN.right - MARGIN.left;
	const CHART_HEIGHT = 400 - MARGIN.top - MARGIN.bottom;

	const xScale = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
	const yScale = d3.scaleLinear().range([CHART_HEIGHT, 0]);

	const chartContainer = d3
		.select("#svg-ps")
		.attr("width", CHART_WIDTH + MARGIN.right + MARGIN.left)
		.attr("height", CHART_HEIGHT + MARGIN.top + MARGIN.bottom);

	xScale.domain(DUMMY_DATA.map((d) => d.season)); // Unique token used to separate data (here, either ID or region can be used)
	yScale.domain([0, d3.max(DUMMY_DATA, d => d.revenue) + 1000]) // Determines max height of the graph (we add 3 so there's some padding above the tallest bar)

	const chart = chartContainer.append("g"); // Group in SVG for the many bars

	chart
		.append("g")
		.call(d3.axisBottom(xScale).tickSizeOuter(0))
		.attr("transform", `translate(${MARGIN.left}, ${CHART_HEIGHT + 10})`)
		.attr("color", "#000");

	chart
		.append("g")
		.call(d3.axisLeft(yScale).tickSizeOuter(0))
		.attr("color", "#000")
		.attr("transform", `translate(${MARGIN.left}, 10)`);

	chart.selectAll(".bar")
		.data(DUMMY_DATA)
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
const MARGIN_FA = {top: 20, right: 5, bottom: 10, left: 40};
const CHART_WIDTH_FA = 600 - MARGIN_FA.right - MARGIN_FA.left;
const CHART_HEIGHT_FA = 400 - MARGIN_FA.top - MARGIN_FA.bottom;

const moreStuff = [98.72404738009172,98.94407289973621,99.14171692141903,99.2652592375488,99.3765154139245,99.46787692544532,99.55432398106454,99.61723493763674,99.6897083596079,99.74791209637071,99.80963884670155,99.8363426974442,99.87867807057278,99.90940822253603,99.94046403121568,99.9705428697462,99.7580962700464,99.56391605161954,99.15323332711625,98.85356993774036,98.15228300160756,97.62090005595374,96.51781194212785,95.65973609963912,93.88931816365135,92.58302025880832,89.98170401357103,87.76611334630029,83.61511520846483,80.21235778423177,75.05866261668102,71.54956347197474,67.21658243999764,64.9553998324347,61.50921164430003,59.42474221310362,55.51857871566923,53.9576764689337,51.14950899848729,49.78047776800775,45.994629624695385,44.99995559226582,43.165590519244915,42.59965835649925,40.507284348642195,40.313311366307545,39.43824216425528,39.40709754010763,38.651425932340466,38.944132110048315,38.91349077355303,39.26591055098155,38.76265250355997,39.208802204991876,39.33823594717245,39.932441033930374,39.780773819568424,40.55166247753726,41.07369019388408,42.06294648275962,42.78279585172533,44.27957333049169,45.70532803993127,47.39240746168406,49.06924349944776,51.097877606364364,53.02313050840919,55.006054254409186,57.0098200302565,59.66110977887937,62.2160939549232,64.4942699220497,66.4808054970854,68.62555102596673,70.68488567969007,72.5788459318075,74.46140819885203,76.37763152830689,78.29802918476284,80.12842716687534,81.94920347327688,83.79008168062548,85.59676593275482,87.27312828802265,88.91574076541167,90.42213991988844,91.81464803910247,92.94902880285628,94.01892953676811,94.93698542538168,95.8113441036891,96.45741742381854,97.05760275209529,97.56278513465905,98.004523667842,98.36247960944878];
var stuffJson = [];
for (var i=0; i<moreStuff.length; i++) {
	stuffJson[i] = {};
	stuffJson[i].id = i;
	stuffJson[i].time = i*15;
	stuffJson[i].percent = moreStuff[i];
}

const chartContainer_FA = d3
	.select("#svg-fa")
	.attr("width", CHART_WIDTH_FA + MARGIN_FA.right + MARGIN_FA.left)
	.attr("height", CHART_HEIGHT_FA + MARGIN_FA.top + MARGIN_FA.bottom);


const xScale_FA = d3.scaleBand().range([0, CHART_WIDTH_FA]).padding(0.1);
const yScale_FA = d3.scaleLinear().range([CHART_HEIGHT_FA, 0]);

xScale_FA.domain(stuffJson.map((d) => d.time)); // Unique token used to separate data (here, either ID or region can be used)
yScale_FA.domain([ 0, d3.max(stuffJson, d => d.percent)]) // Determines max height of the graph (we add 3 so there's some padding above the tallest bar)

const chart_FA = chartContainer_FA.append("g"); // Group in SVG for the many bars

chart_FA
	.append("g")
	.call(d3.axisBottom(xScale_FA).tickSizeOuter(0))
	.attr("transform", `translate(${MARGIN_FA.left}, ${CHART_HEIGHT_FA+10})`)
	.attr("color", "#000");

chart_FA
	.append("g")
	.call(d3.axisLeft(yScale_FA).tickSizeOuter(0))
	.attr("color", "#000")
	.attr("transform", `translate(${MARGIN_FA.left}, 10)`);

const area_FA = d3.area()
	.curve(d3.curveLinear)
	.x(d => xScale_FA(d.time))
	.y0(yScale_FA(0))
	.y1(d => yScale_FA(d.percent)); //yScale_FA(d.revenue)

console.log(yScale_FA(0));

chart_FA
	.append("path")
	.datum(stuffJson)
	.attr("fill", "rgba(57, 181, 74, 0.1)")
	.attr("stroke", "rgba(57, 181, 74, 1.0)")
	.attr("stroke-width", "2")
	.attr("d", area_FA);
