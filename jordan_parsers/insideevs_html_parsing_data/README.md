
# Vehicle Type Battery Capacity Data (InsideEvs Html data)

## External NPM Dependancies:
  0. [Cheerio](https://www.npmjs.com/package/cheerio)
  1. [Node-fetch](https://www.npmjs.com/package/node-fetch)

## Data Source:
  0. Parses 2 tables from `vehicles.csv` from [insideevs.com](https://insideevs.com/reviews/344001/compare-evs/)

## Insideevs_html_parser.js
  0. Used to parse [insideevs.com](https://insideevs.com/reviews/344001/compare-evs/)'s data. 
  1. More code may be added to the `main` function in order to use the parsed data.

## Parsed Data Representation:
  0. Parsed data in a variable called `data`
  1. `data` is an array of objects, each object is a vehicle entry:
     * Vehicle entries represent a row in one of the 2 tables
     * Vehicle entries have 2 members:
       - `modelName` (a string)
       - `batteryKWhCapacity` (a number, represents capacity in kWh)
