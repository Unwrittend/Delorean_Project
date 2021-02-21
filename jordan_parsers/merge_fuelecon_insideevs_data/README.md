
# Merge "fuelecon" & "insideevs" Datasets

## External NPM Dependancies:
  0. [Cheerio](https://www.npmjs.com/package/cheerio)
  1. [Node-fetch](https://www.npmjs.com/package/node-fetch)

## Invariants:
  0. Adjust the `INSIDEEVS_PARSER_PATH` & `FUELECON_JSON_PATH` variables as needed!

## Merge_INSIDEEVS_and_FUELECON_data.js
  0. `require` as a library: exports the `mergeData` nullary function
     - `mergeData` returns a [promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) that resolves to an array merged vehicles

## Parsed Data Representation:
  0. Same data structure as `fuelecon_csv_parser.js`, but with `batteryKWhCapacity` as a new member
