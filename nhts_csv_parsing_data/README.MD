
# Charging Percentages (NHTS CSV data)

## Semantics:
  0. "present" denotes assumption user can only charge before their first trip<br>
     and after their last trip of the day.
  1. "future" denotes assumption user can charge anytime they aren't driving.

## Data Description:
  0. Realized as an array of values. 
     * Values = percentages of total cars charging throughout the given time slot.
     * Indices = time slot # (each slot is 15min)
       - Multiply an index by 15 to get the minute of the day at which its associated slot begins.
