//Author: Chris Pitterle
//Created: 4/12/21


/*
Script's goal: Calculate EV Battery Degradation using Uddin's algorithms. 
    Used equivalent circuit model (ECM) for CF and PF algorithms.

Algorithms used:
    - Capacity Fade: CF = 1 - (Q - u_CF * Q_rated)/(Q_rated - u_CF * Q_rated)
    - Power Fade: PF = 1 / {u_PF - 1} * {[(R_0 + R_CT) / (R_0(0) + R_CT(0))] - 1}
    - conversion to cost: max[CF x $_batt, PF x $_batt]
    - Battery Management System (BMS)
*/

/**
 * 
 * @param {*} batt_price = price of a replacement battery
 * @param {*} CF = capacity fade
 * @param {*} PF = power fade
 * @returns 
 */
function convert_batt_degrad_to_dollar(batt_price, CF, PF) {
    return Math.max(CF * batt_price, PF * batt_price)
}

/**
 * Calculates the EV's current capacity fade
 * 
 * Algorithm: CF = 1 - (cell_cap - CF_factor * max_rated_cell_cap) / (max_rated_cell_cap - CF_factor * max_rated_cell_cap);
 * 
 * @param {*} cell_cap - cell/battery capacity of vehicle 
 * @param {*} CF_factor - the point at which a vehicle's battery is no longer fit for purpose 
 *                          (often cited at 0.8 so this is the default) 
 * @param {*} max_rated_cell_cap - manufacturer defined max capacity of a new, mint battery 
 * @return Capacity Fade of EV battery
 */
function veh_capacity_fade(cell_cap, max_rated_cell_cap, CF_factor = .8) {
    return 1 - (cell_cap - CF_factor * max_rated_cell_cap) / (max_rated_cell_cap - CF_factor * max_rated_cell_cap);
    //TODO: Needs to calc what cell cap is
}

/**
 * Calculates the power fade of a EV battery 
 * 
 * Algorithm: PF = (1 / (PF_factor - 1)) * (((internal_res + charge_transfer_res) / (init_charge_transfer_res + init_internal_res)) - 1);
 *
 * @param {*} internal_res 
 * @param {*} charge_transfer_res 
 * @param {*} init_internal_res 
 * @param {*} init_charge_transfer_res 
 * @param {*} PF_factor 
 * @returns power fade
 */
function veh_power_fade(internal_res, charge_transfer_res, init_internal_res, init_charge_transfer_res, PF_factor) {
    return (1 / (PF_factor - 1)) * (((internal_res + charge_transfer_res) / (init_charge_transfer_res + init_internal_res)) - 1);
    //TODO: Needs to calc what internal and charge transfer res
}

/**
 * bms means battery management system
 */
function bms() {
    //TODO
}

//TODO: degrade battery functions (ie mkae each battery lose CF and PF)