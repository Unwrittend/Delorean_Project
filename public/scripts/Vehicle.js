//Author: Chris Pitterle


let Vehicle = class {
    #battery_capacity;
    #vehicle_type;
    #participating_start;       //the hours a vehicle chooses to participate in V2G events
    #participating_end;
    #min_SOC;

    /**
     * 
     * @param {*} type - set by user
     * @param {*} hour_start - set by user
     * @param {*} hour_end - set by user or default 0 (mil time)
     * @param {*} min_charge - set by slider or default 2400 (mil time)
     */
    Vehicle(type, min_charge, hour_start = 0, hour_end = 2400) {
        
        //get vehicle statistics
        
    }
}