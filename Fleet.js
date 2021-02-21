//Author: Chris Pitterle - Fleet

let Fleet = class {

    //private variables
    #capacity = 0;
    #num_vehicles = 0;
    #operating_costs = 0;
    #average_min_SOC = 50;

    //constructors
    constructor() { 
        this.#capacity = 0;
        this.#num_vehicles = 0;
        this.#operating_costs = 0;
    }

    //TO CALCULATE OPERATING COSTS
    //INCLUDES GRID TRANSMISSION AND BATTERY DEGRADATION
    calc_operating_costs() {
        this.#operating_costs = 0;
    }

    




}
