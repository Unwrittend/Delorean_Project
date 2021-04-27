// Author: Jordan Randleman -- merge_INSIDEEVS_and_FUELECON_data.js
// Use: designed to merge data parsed from "fuelecon_csv_parser.js" & "insideevs_html_parser.js"
// Exported Function: "mergeData"

/******************************************************************************
* PARSER FILEPATHS (CHANGE AS NEEDED)
******************************************************************************/

const INSIDEEVS_PARSER_PATH = '../insideevs/insideevs_html_parser.js';

const FUELECON_JSON_PATH = '../fuelecon/FUELECON_JSON_FILE/fuelecon_vehicles.json';

/******************************************************************************
* LIBRARY MODULES
******************************************************************************/

const fs = require('fs');

const InsideevsParser = require(INSIDEEVS_PARSER_PATH);

/******************************************************************************
* FUEL ECON JSON FILE READER
******************************************************************************/

function readFueleconJson() {
  try {
    return JSON.parse(fs.readFileSync(FUELECON_JSON_PATH, 'utf8'));
  } catch(e) {
    console.log('Error:', e.stack);
    return null;
  }
}

/******************************************************************************
* DATA MERGING HELPER FUNCTIONS
******************************************************************************/

function mergeDataSets(fuelEconData, insideevsData) {
  let merged = [];
  for(let fuelDatum of fuelEconData) {
    const fuelEconName = `${fuelDatum.year} ${fuelDatum.make} ${fuelDatum.model}`;
    for(let insideDatum of insideevsData) {
      if(fuelEconName == insideDatum.modelName) { // Same Model Name!
        merged.push({
          ...fuelDatum,
          batteryKWhCapacity: insideDatum.batteryKWhCapacity
        })
      }
    }
  }
  return merged;
}

/******************************************************************************
* MAIN DISPATCH
******************************************************************************/

exports.mergeData = function() {
  return new Promise((resolve, reject) => {
    return InsideevsParser.parseInsideEvs().then(insideevsData => resolve(mergeDataSets(readFueleconJson(), insideevsData)));
  });
}