// Author: Jordan Randleman -- insideevs_html_parser.js
// Use: designed to parse 2 tables from "https://insideevs.com/reviews/344001/compare-evs/"
//      *) 2 Tables being parsed are those w/ model-name & battery-capacity (kWh) data
// Exported Function: 

/******************************************************************************
* EXTERNAL NPM LIBRARY DEPENDANCIES
******************************************************************************/

const fetch = require('node-fetch');
const cheerio = require('cheerio');

/******************************************************************************
* SOURCE URL
******************************************************************************/

const SOURCE_URL = "https://insideevs.com/reviews/344001/compare-evs/";

/******************************************************************************
* HTML COLUMN INDICES FOR DATA IN TABLES
******************************************************************************/

const MODEL_NAME_IDX = 0;

const BATTER_KWH_CAPACITY_IDX = 2;

/******************************************************************************
* HELPER FUNCTIONS
******************************************************************************/

function getTableRows($table) {
  return Object.values($table.children).filter(e => e.type == 'tag' && e.name == 'tr');
}


function getRowColumns($row) {
  return Object.values($row.children).filter(e => e.type == 'tag' && e.name == 'td');
}


function getRowModelName($columnsOfRow) {
  return $columnsOfRow[MODEL_NAME_IDX].children[0].children[0].data;
}


function getRowBatteryCapacity($columnsOfRow) {
  return parseFloat($columnsOfRow[BATTER_KWH_CAPACITY_IDX].children[0].data);
}


function getRowValuesObject($row) {
  const values = getRowColumns($row);
  return {
    modelName: getRowModelName(values),
    batteryKWhCapacity: getRowBatteryCapacity(values),
  };
}


function parseHtml(html) {
  const $ = cheerio.load(html);
  const data = [];
  const table1Rows = getTableRows($('tbody')['1']);
  const table2Rows = getTableRows($('tbody')['3']);
  for(let r = 1; r < table1Rows.length; ++r)
    data.push(getRowValuesObject(table1Rows[r]));
  for(let r = 1; r < table2Rows.length; ++r)
    data.push(getRowValuesObject(table2Rows[r]));
  return data;
}

/******************************************************************************
* PARSER EXPORT
******************************************************************************/

exports.parseInsideEvs = function() {
  return fetch(SOURCE_URL, {method: 'get'})
    .then(response => response.text())
    .then(html => {
      const data = parseHtml(html);
      return new Promise((resolve, reject) => resolve(data));
    }).catch(err => new Promise((resolve, reject) => reject(err)));
}
