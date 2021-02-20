
# Vehicle Type Variable Data (FUELECON CSV data)

## Fuelecon_csv_parser.js
  0. Used to generate the JSON file contents

## Tuning Sought Variable Set:
  0. Add/rm variable values to seek by altering the `SOUGHT_VARIABLES` array in `fuelecon_csv_parser.js`

## Data Description:
  0. Realized as an array of objects. 
     * Each object represents a set of variable name-value pairs for each row.
     * Only parses row data if row's `atvType` is `EV`, `Hybrid`, or `Plug-in Hybrid`
