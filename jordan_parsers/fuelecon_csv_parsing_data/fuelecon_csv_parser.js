// Author: Jordan Randleman -- fuelecon_csv_parser.js
// Use: designed to parse "vehicles.csv" from "https://www.fueleconomy.gov/feg/ws/index.shtml"

/******************************************************************************
* LIBRARY MODULES
******************************************************************************/

var fs = require('fs');

/******************************************************************************
* PARSER INVARIANTS
******************************************************************************/

const CSV_FILEPATH = 'FUELECON_CSV_FILE/vehicles.csv';


const SOUGHT_VARIABLES = 
[
  'charge120', 'charge240', 'charge240b',
  'rangeA', 'rangeCityA', 'rangeHwyA',
  'make',
  'UCity', 'UCityA', 'UHighway', 'UHighwayA', 'cityE', 
  'model',
  'year',
];

/******************************************************************************
* READ THE CSV FILE & SPLIT INTO AN ARRAY OF ROWS
******************************************************************************/

function readCsvRows() {
  try {
    let arr = fs.readFileSync(CSV_FILEPATH, 'utf8').split('\n');
    arr.pop(); // rm last empty entry
    return arr;
  } catch(e) {
    console.log('Error:', e.stack);
    return null;
  }
}

/******************************************************************************
* GET INDICES OF SOUGHT VARIABLES
******************************************************************************/

const SOUGHT_VARIABLES_INDICES = [];


function populateSoughtVariableIndices(firstRow) {
  for(let soughtVar of SOUGHT_VARIABLES) {
    const idx = firstRow.indexOf(soughtVar);
    if(idx < 0) {
      console.error(`Variable "${soughtVar}" doesn't exist in the CSV!`);
      return false;
    }
    SOUGHT_VARIABLES_INDICES.push(idx);
  }
  return true;
}

/******************************************************************************
* CSV PARSING HELPER FUNCTIONS
******************************************************************************/

const ATV_TYPE_INDEX = 69; // indexOf 'atvType' in 1st row


function isValidAtvType(atvType) {
  if(!atvType) return false;
  const typeStr = atvType.trim().toLowerCase();
  return typeStr == 'ev' || typeStr == 'hybrid' || typeStr == 'plug-in hybrid';
}


function parseRowVariableValue(value) {
  let trimmedValue = value.trim();
  if(!trimmedValue) return null;
  if(isNaN(trimmedValue)) return trimmedValue;
  return parseFloat(trimmedValue); // convert to number if possible

}


function parseRowVariables(row) {
  let rowVariablesObj = {};
  for(let i = 0; i < SOUGHT_VARIABLES.length; ++i)
    rowVariablesObj[SOUGHT_VARIABLES[i]] = parseRowVariableValue(row[SOUGHT_VARIABLES_INDICES[i]]);
  return rowVariablesObj;
}


function parseCsvForVariables(data) {
  // Populate indices of sought variables to parse
  if(!populateSoughtVariableIndices(data[0].split(','))) return [];
  // Get sought variable values
  let variablesMap = [];
  for(let rowIdx = 1; rowIdx < data.length; ++rowIdx) {
    const row = data[rowIdx].split(',');
    if(!isValidAtvType(row[ATV_TYPE_INDEX])) continue;
    variablesMap.push(parseRowVariables(row));
  }
  return variablesMap;
}

/******************************************************************************
* MAIN DISPATCH
******************************************************************************/

function print(obj) {
  console.log(JSON.stringify(obj));
}


function main() {
  print(parseCsvForVariables(readCsvRows()));
}


main();