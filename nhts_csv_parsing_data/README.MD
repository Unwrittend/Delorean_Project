
# Charging Percentages (NHTS CSV data)

## Csv_parser.js
  0. Used to generate both JSON file contents

## JSON File Naming Semantics:
  0. "present" assumes user only charges prior their first (& after their last) trip of the day.
  1. "future" assumes user can charge anytime they aren't driving.

## Data Description:
  0. Realized as an array of values. 
     * Values = percentages of total cars charging throughout the given time slot.
     * Indices = time slot # (each slot is 15min)
       - Multiply an index by 15 to get the minute of the day at which its associated slot begins.
