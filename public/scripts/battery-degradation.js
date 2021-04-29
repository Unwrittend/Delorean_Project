//Author: Chris Pitterle
//Created: 4/12/21
//Last Update: 4/26/21


/*
Script's goal: Calculate EV Battery Degradation using Uddin's algorithms. 
    Used equivalent circuit model (ECM) for CF and PF algorithms.

Algorithms used:
    - Capacity Fade: CF = 1 - (Q - u_CF * Q_rated)/(Q_rated - u_CF * Q_rated)           --Uddin et al 2017
    - Power Fade: PF = 1 / {u_PF - 1} * {[(R_0 + R_CT) / (R_0(0) + R_CT(0))] - 1}       --Uddin et al 2017
    - conversion to cost: max[CF x $_batt, PF x $_batt]                                 --Uddin et al 2017
    - Battery Management System (BMS)                                                   --Uddin et al 2017

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
 * Algorithm from Uddin et al. 2017
 * Calculates the EV's current capacity fade if you know the max cap and current cap
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
 * Algorithm from Uddin et al. 2017
 * Calculates the power fade of a EV battery if you know the max resistance and current resistance
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
 * Algorithm from Cordoba-Arenas et al. 2015
 * calculates the capacity lose (%) of capacity fade under SOC, total Ampere hours sent, and Temp conditions
 * 
 * @param {*} SOC_min = the minimum SOC 
 * @param {*} Ah = Ampere-hour throughput ie the total current to the battery over time T 
 *                      (do we control this? Let's say the CR [ie C] is 1C == 2A)
 * @param {*} tempurature = tempurature of the cells in the vehicle (Unit: Kelvin)
 * @param {*} time_cd = time in charge depleting mode (Hybrid only. If full EV, set to 1)
 * @param {*} time_cs = time in charge sustain mode (Hybrid only. If full EV, set to 0)
 * @returns Q_loss-cycle, a percentage of capacity lose
 */
function calc_cf(SOC_min, Ah, tempurature, time_cd = 1, time_cs = 0) {
    //constants
    var a_c = 137,
        B_c = 420,
        y_c = 9610,
        b_c = 0.34,
        c_c = 3,
        E_a = 22406,    //Unit: J/mol
        R = 8.314,      //Unit: J/(mol*K)
        z = 0.48;
    
    var ratio = time_cd / (time_cd + time_cs);

    return (a_c + B_c * (Math.pow(ratio, b_c)) + y_c * Math.pow(SOC_min - 0.25), c_c) * Math.E((-E_a / (R * tempurature))) * Math.pow(Ah, z);
}

/**
 * Algorithm from Cordoba-Arenas et al. 2015
 * calculates the resistance growth of power fade using SOC, total Ampere hours sent, and Temp conditions
 * 
 * @param {*} SOC_min = the minimum SOC 
 * @param {*} Ah = Ampere-hour throughput ie the total current to the battery over time T 
 *                      (do we control this? Let's say the CR [ie C] is 1C == 2A)
 * @param {*} tempurature = tempurature of the cells in the vehicle (Unit: Kelvin)
 * @param {*} time_cd = time in charge depleting mode (Hybrid only. If full EV, set to 1)
 * @param {*} time_cs = time in charge sustain mode (Hybrid only. If full EV, set to 0)
 * @returns a percentage of power lose
 */
function calc_pf(SOC_min, Ah, tempurature, time_cd = 1, time_cs = 0) {
    var a_r = 3.2053 * Math.pow(10, 5),
        B_r = 1.3573 * Math.pow(10, 9),
        y_r = 3.6342 * Math.pow(10, 3),
        c_r = 5.45,
        d_r = 0.9179,
        e_r = 1.8277,
        E_aR = 51800,   //Unit: J/mol
        R = 8.314;       //Unit: J/(mol*K)
    
        var ratio = time_cd / (time_cd + time_cs);
    
    return (a_r) + (B_r * Math.pow(SOC_min - 0.25, c_r)) + (y_r * Math.E(d_r * (5 - ratio)) + e_r * (SOC_min - 0.25) * Math.E(-E_aR / (R * tempurature)) * Ah);
}

/**
 * bms means battery management system
 */
function bms() {
    //TODO
}

//TODO: degrade battery functions (ie mkae each battery lose CF and PF)