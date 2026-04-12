function searchFlights(flights, searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') return flights;
    const lowerTerm = searchTerm.toLowerCase();
    
    return flights.filter(flight => {
        const callsign = (flight.callsign || "").toLowerCase();
        const country = (flight.origin_country || "").toLowerCase();
        
        return callsign.includes(lowerTerm) || country.includes(lowerTerm);
    });
}

function filterFlights(flights, criteria) {
    return flights.filter(flight => {
        if (criteria.country && criteria.country !== 'all') {
            if (flight.origin_country !== criteria.country) return false;
        }
        
        if (criteria.onlyAirborne) {
            if (flight.on_ground === true) return false;
        }
        
        if (criteria.altitudeBand && criteria.altitudeBand !== 'all') {
            const alt = flight.baro_altitude !== null ? flight.baro_altitude : 0;
            if (criteria.altitudeBand === 'low' && alt >= 3000) return false;
            if (criteria.altitudeBand === 'high' && alt < 3000) return false;
        }
        
        return true;
    });
}

function sortFlights(flights, sortBy, order = 'desc') {
    const clonedArray = [...flights]; 
    
    return clonedArray.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        
        if (typeof valA === 'string' && typeof valB === 'string') {
            const result = valA.localeCompare(valB);
            return order === 'asc' ? result : -result;
        } 
        
        valA = valA !== null && valA !== undefined ? valA : 0;
        valB = valB !== null && valB !== undefined ? valB : 0;
        
        return order === 'asc' ? (valA - valB) : (valB - valA);
    });
}

function paginateFlights(flights, page, perPage) {
    const startIndex = (page - 1) * perPage;
    return flights.slice(startIndex, startIndex + perPage);
}

function getUniqueCountries(flights) {
    const rawCountries = flights.map(f => f.origin_country);
    
    const distinctList = rawCountries.reduce((accumulator, item) => {
        const cty = item && item.trim() !== "" ? item : "Unknown";
        if (!accumulator.includes(cty)) {
            accumulator.push(cty);
        }
        return accumulator;
    }, []);
    
    return distinctList.sort();
}
