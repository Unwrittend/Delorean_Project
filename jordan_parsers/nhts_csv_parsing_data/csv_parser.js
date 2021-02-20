// Author: Jordan Randleman -- csv_parser.js
// Use: designed to parse "trippub.csv" from "https://nhts.ornl.gov/"

/******************************************************************************
* LIBRARY MODULES
******************************************************************************/

var fs = require('fs');

/******************************************************************************
* CLEANING MODIFICATIONS TO THE DATASET (LISTED BY ROWS CHANGED)
******************************************************************************/

// 0. 44085: removed. duplicate end value with the above, but as if user drove from midnight to 11:30 rather than 11-11:30

// => ALL THE BELOW ROW #S CORRELATE TO THE CSV _AFTER_ RMING THE ABOVE ROW!

// 1. 85063, 85064: MADE 11'S INTO 10'S (11'S WERE OUT OF PLAC EIN ATTENDANCE PATTERN)
// 2. 168510, 168511: SWAPPED TO BE IN SORTED ORDER (WRT TIME TRIP LEFT/ARRIVED)
// 2. 168635: 0230 CHANGED TO 1430 (ELSE DOESN'T MAKE SENSE IN CONTEXT OF OTHER NUMBERS -- USER LIKELY MIXED UP 2AM W/ 2PM IN MILITARY TIME)
// 3. 160316: MKS NO SENSE. 0359 CHANGED TO 1600 THEN MOVED UP TO BE ROW 160314 (USER MAY HAVE MIXED UP 3:59AM WITH 3:59PM MILITARY TIME, 
//                                                                               ROUNDED UP 1MIN TO FIT WITH LAST TRIP'S END TIME OF 4PM)
// 4. 219679: ENDTIME changed from 1751 to 1851 (unless someone drove 24hrs straight lol)

/******************************************************************************
* FORMULAS TO COMPUTE
******************************************************************************/

// KEYS WITH WHICH TO ASSOCIATE THE FOLLOWING VALUES: 
//   HOUSEID-PERSONID-VEHID-TRAVDAY-HASH
//   *) IGNORE ANY KEYS WITH NEGATIVE "VEHID" VALUES !!!

// VERSION 1: PRESENT
//   Range_time_absent = (last entry's ENDTIME) - (first entry's STARTTIME) [[[ENDTIME & STRTTIME in terms of "HHMM"]]]
//   Veh_charging = (24 * 60) - Range_time_absent
//   *) SUM OF "DWELTIME" IS:
//        0. RELATIVE TO ALL VALUES PER ROW WITHIN THE DAY RANGE OF VALUES PER VEHICLES
//        1. IGNORE NEGATIVE VALUES OF SUCH

// VERSION 2: FUTURE, WITH CHARGING AT ALL PAUSES IN TRIPS
//   Range_time_absent = sum(TRVLCMIN)
//   Veh_charging = (24 * 60) - Range_time_absent

/******************************************************************************
* INFO ON "trippub.csv" FILE
******************************************************************************/

/***
 * ROWS = TRIPS (HOUSES VAVE SEVERAL TRIPS & SEVERAL VEHICLES & SEVERAL PEOPLE)
 *   *) NOTE: THE SAME VEHID CORRESPONDS TO DIFFERENT VEHICLES WHEN PAIRED 
 *            WITH DIFFERENT HOUSE IDS IN THE SAME ROW !!!
 */

/******************************************************************************
* INDEX POSITION CONSTANTS
******************************************************************************/

const STRTTIME_IDX = 3;
const ENDTIME_IDX  = 4;

const TRVLCMIN_IDX = 5;
const DWELTIME_IDX = 27;

const HOUSEID_IDX  = 0;
const PERSONID_IDX = 1;
const VEHID_IDX    = 10;
const TRAVDAY_IDX  = 59;

/******************************************************************************
* PARSER INVARIANTS
******************************************************************************/

const MINUTES_PER_SLOT = 15; // !!! 60 __MUST__ BE DIVISIBLE BY THIS !!!

const CSV_FILEPATH = 'GOVT_FILES/trippub.csv';

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
* USE PERCENTAGE REGISTRATION
******************************************************************************/

const TOTAL_CARS = 225186; // total cars per person per house per day

const TOTAL_MINUTE_SLOTS = (60 * 24) / MINUTES_PER_SLOT;

const TOTAL_CARS_NOT_CHARGING_THROUGHOUT_DAY = []; // array of minute-slots


function populateUseEntry(idx, value) {
  if(!TOTAL_CARS_NOT_CHARGING_THROUGHOUT_DAY[idx]) {
    TOTAL_CARS_NOT_CHARGING_THROUGHOUT_DAY[idx] = value;
  } else {
    TOTAL_CARS_NOT_CHARGING_THROUGHOUT_DAY[idx] += value;
  }
}


// Get <timeInMinutes>'s lower-bound slot-index in <TOTAL_CARS_NOT_CHARGING_THROUGHOUT_DAY>
function getMinuteChunkLowerBoundIndex(timeInMinutes) {
  const TOTAL_MINUTES_PER_DAY = 60 * 24;
  for(let i = 0; i < TOTAL_MINUTES_PER_DAY; i += MINUTES_PER_SLOT)
    if(i + MINUTES_PER_SLOT > timeInMinutes)
      return i / MINUTES_PER_SLOT;
}


function getUpperBoundIndex(lowerBound) {
  return lowerBound + 1;
}

function populateUseArray(beginTimeStr, endTimeStr) {
  const begin = convertHHMMtoMinutes(beginTimeStr);
  const end   = convertHHMMtoMinutes(endTimeStr);
  const beginLowerBoundIdx = getMinuteChunkLowerBoundIndex(begin);
  const endLowerBoundIdx   = getMinuteChunkLowerBoundIndex(end);
  // Both begin & end are within the same slot
  if(beginLowerBoundIdx == endLowerBoundIdx) {
    populateUseEntry(beginLowerBoundIdx, Math.abs(end - begin) / MINUTES_PER_SLOT);
  // Begin & end are in different slots
  } else {
    // Populate begin & end PORTIONS of slots
    populateUseEntry(beginLowerBoundIdx, ((getUpperBoundIndex(beginLowerBoundIdx) * MINUTES_PER_SLOT) - begin) / MINUTES_PER_SLOT);
    populateUseEntry(endLowerBoundIdx, (end - (endLowerBoundIdx * MINUTES_PER_SLOT)) / MINUTES_PER_SLOT);
    // Populate any slots btwn the begin/end slots as having been NOT charging throughout their entire duration
    if(beginLowerBoundIdx < endLowerBoundIdx) { // begin/end occured in the same day
      for(let i = beginLowerBoundIdx+1; i < endLowerBoundIdx; ++i)
        populateUseEntry(i, 1.0);
    } else {                                    // begin/end occured over 2 days
      for(let i = beginLowerBoundIdx+1; i < endLowerBoundIdx + TOTAL_MINUTE_SLOTS; ++i)
        populateUseEntry(i % TOTAL_MINUTE_SLOTS, 1.0);
    }
  }
}

function getUseArray() {
  let PERCENTAGE_OF_CARS_CHARGING_THROUGHOUT_DAY = [];
  // "1 -" accounts for aray currently holds time NOT charging (desire opposite)
  for(let i = 0; i < TOTAL_MINUTE_SLOTS; ++i) {
    if(!TOTAL_CARS_NOT_CHARGING_THROUGHOUT_DAY[i]) {
      PERCENTAGE_OF_CARS_CHARGING_THROUGHOUT_DAY.push(0);
    } else {
      PERCENTAGE_OF_CARS_CHARGING_THROUGHOUT_DAY.push(100 * (1 - (TOTAL_CARS_NOT_CHARGING_THROUGHOUT_DAY[i] / TOTAL_CARS)));
    }
  }
  return PERCENTAGE_OF_CARS_CHARGING_THROUGHOUT_DAY;
}

/******************************************************************************
* DATA PARSING HELPER FUNCTIONS
******************************************************************************/

function hashVehicleId(houseId, personId, vehId, travDay) {
  return houseId.replace(/"/g, '') + ':' + 
         personId.replace(/"/g, '') + ':' + 
         vehId.replace(/"/g, '') + ':' + 
         travDay.replace(/"/g, '');
}

function isInvalidVehicleId(vehId) {
  return vehId == '"-1"' || vehId == -1;
}

function convertHHMMtoMinutes(numStr) {
  numStr = numStr.replace(/"/g, '');
  return (parseInt(numStr.substr(0,2)) * 60) + parseInt(numStr.substr(2));
}

function convertUseRangeToMinutes(begin, end, entireDayPassed) {
  if(entireDayPassed) 
    return end + (24 * 60) - begin; // ie if drove from 2300 to 0000
  return end - begin;
}

function parseValue(numStr) {
  let num = parseFloat(numStr);
  return (num < 0) ? 0 : num;
}

function parseStartEndTimes(data, populateVehicleUseMapEntry) {
  let vehicleUseMap = {};
  for(let rowIdx = 1; rowIdx < data.length; ++rowIdx) {
    const row = data[rowIdx].split(',');
    if(isInvalidVehicleId(row[VEHID_IDX])) continue;
    const key = hashVehicleId(row[HOUSEID_IDX],row[PERSONID_IDX],row[VEHID_IDX],row[TRAVDAY_IDX]);
    populateVehicleUseMapEntry(vehicleUseMap, key, row);
  }
  return vehicleUseMap;
}

/******************************************************************************
* DERIVE VERSION1 DATASET -- GET TOTAL MINUTE RANGE SUMS FOR VARIABLES (OLD)
******************************************************************************/

// function v1CsvRowParser(vehicleUseMap, key, row) {
//   const beginTime = convertHHMMtoMinutes(row[STRTTIME_IDX]);
//   const endTime   = convertHHMMtoMinutes(row[ENDTIME_IDX]);
//   if(!vehicleUseMap[key]) {
//     vehicleUseMap[key] = {
//       // beginStr: row[STRTTIME_IDX], // @DEBUG -- helps ID entry(s) in CSV
//       // endStr: row[ENDTIME_IDX],    // @DEBUG -- helps ID entry(s) in CSV
//       begin: beginTime,
//       end: endTime,
//       entireDayPassed: endTime < beginTime, // ie if drove from 2300 to 0000
//     };
//   } else {
//     // vehicleUseMap[key].endStr = row[ENDTIME_IDX]; // @DEBUG -- helps ID entry(s) in CSV
//     vehicleUseMap[key].entireDayPassed = vehicleUseMap[key].entireDayPassed || 
//                                          endTime < vehicleUseMap[key].end   || 
//                                          beginTime < vehicleUseMap[key].begin;
//     vehicleUseMap[key].end = endTime;
//   }
// }


// function getVersion1Data(data) {
//   let vehicleUseMap = parseStartEndTimes(data,v1CsvRowParser);
//   for(let key in vehicleUseMap) {
//     vehicleUseMap[key].Range_time_absent = convertUseRangeToMinutes(vehicleUseMap[key].begin,
//                                                                     vehicleUseMap[key].end,
//                                                                     vehicleUseMap[key].entireDayPassed);
//     vehicleUseMap[key].Veh_charging = (24 * 60) - vehicleUseMap[key].Range_time_absent;
//     delete vehicleUseMap[key].begin;
//     delete vehicleUseMap[key].end;
//     delete vehicleUseMap[key].entireDayPassed;
//   }
//   return vehicleUseMap;
// }

/******************************************************************************
* DERIVE VERSION1 DATASET -- POPULATE CHARGING PERCENTAGES (NEW)
******************************************************************************/

function v1CsvRowParser(vehicleUseMap, key, row) {
  if(!vehicleUseMap[key]) {
    vehicleUseMap[key] = {
      begin: row[STRTTIME_IDX],
      end: row[ENDTIME_IDX],
    };
  } else {
    vehicleUseMap[key].end = row[ENDTIME_IDX];
  }
}
getUseArray


function getVersion1Data(data) {
  let vehicleUseMap = parseStartEndTimes(data,v1CsvRowParser);
  for(let key in vehicleUseMap)
    populateUseArray(vehicleUseMap[key].begin,vehicleUseMap[key].end);
  return getUseArray();
}

/******************************************************************************
* DERIVE VERSION2 DATASET -- GET TOTAL MINUTE RANGE SUMS FOR VARIABLES (OLD)
******************************************************************************/

// function v2CsvRowParser(vehicleUseMap, key, row) {
//   if(!vehicleUseMap[key]) {
//     vehicleUseMap[key] = parseValue(row[TRVLCMIN_IDX]);
//   } else {
//     vehicleUseMap[key] += parseValue(row[TRVLCMIN_IDX]);
//   }
// }


// function getVersion2Data(data) {
//   let vehicleUseMap = parseStartEndTimes(data,v2CsvRowParser);
//   for(let key in vehicleUseMap) {
//     vehicleUseMap[key] = {
//       Range_time_absent: vehicleUseMap[key],
//       Veh_charging: (24 * 60) - vehicleUseMap[key],
//     };
//   }
//   return vehicleUseMap;
// }
 
/******************************************************************************
* DERIVE VERSION2 DATASET -- POPULATE CHARGING PERCENTAGES (NEW)
******************************************************************************/

function v2CsvRowParser(vehicleUseMap, key, row) {
  populateUseArray(row[STRTTIME_IDX],row[ENDTIME_IDX]);
}


function getVersion2Data(data) {
  parseStartEndTimes(data,v2CsvRowParser);
  return getUseArray();
}

/******************************************************************************
* MAIN DISPATCH
******************************************************************************/

function printObj(obj) {
  console.log(JSON.stringify(obj,null,2));
}


function printArr(arr) {
  console.log(JSON.stringify(arr));
}


function main() {
  // printArr(getVersion1Data(readCsvRows())); // GENERATES DATA FOR PRESENT
  printArr(getVersion2Data(readCsvRows())); // GENERATES DATA FOR FUTURE
}


main();
