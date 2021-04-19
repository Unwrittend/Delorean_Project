
# Vehicle Type Battery Capacity Data (InsideEvs Html data)

## External NPM Dependancies:
  0. [Cheerio](https://www.npmjs.com/package/cheerio)
  1. [Node-fetch](https://www.npmjs.com/package/node-fetch)

## Data Source:
  0. Parses 2 tables from [insideevs.com](https://insideevs.com/reviews/344001/compare-evs/)

## Insideevs_html_parser.js
  0. Used to parse [insideevs.com](https://insideevs.com/reviews/344001/compare-evs/)'s data. 
  1. `require` as a library: exports the `parseInsideEvs` nullary function
     - `parseInsideEvs` returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to an array of vehicle entries.

## Parsed Data Representation:
  0. Array of objects, each object is a vehicle entry:
     * Vehicle entries represent a row in one of the 2 tables
     * Vehicle entries have 2 members:
       - `modelName` (a string)
       - `batteryKWhCapacity` (a number, represents capacity in kWh)
