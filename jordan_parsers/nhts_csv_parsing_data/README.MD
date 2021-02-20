
# Charging Percentages (NHTS CSV data)

## Nhts_csv_parser.js
  0. Used to generate both JSON file contents

## JSON File Naming Semantics:
  0. "present" assumes user only charges prior their first (& after their last) trip of the day.
  1. "future" assumes user can charge anytime they aren't driving.

## Data Description:
  0. Realized as an array of values. 
     * Values = percentages of total cars charging throughout the given time slot.
     * Indices = time slot # (each slot is 15min)
       - Multiply an index by 15 to get the minute of the day at which its associated slot begins.

## CSV File Data Cleaning BY ROW NUMBER
  0. 44085: removed. duplicate end value with the above, but as if user drove from midnight to 11:30 rather than 11-11:30
     * _NOTE: ALL THE BELOW ROW #S CORRELATE TO THE CSV **AFTER** RMING THE ABOVE ROW!_
  1. 85063, 85064: MADE 11'S INTO 10'S 
     * 11's were out of place in attendance pattern
  2. 168510, 168511: swapped to be in sorted order (wrt time trip left/arrived)
  2. 168635: 0230 change to 1430 
     * Otherwise doesn't make sense in context of other numbers
       - User likely mixed up 2am w/ 2pm in military time
  3. 160316: Makes no sense. 0359 changed to 1600 then moved up to be row 160314 
     * User may have mixed up 3:59AM w/ 3:59PM military time
       - Also rounded up 1min to fit with last trip's end time of 4pm
  4. 219679: ENDTIME changed from 1751 to 1851 (unless someone drove 24hrs straight lol)
