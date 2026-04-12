const BASE_URL = 'https://opensky-network.org/api/states/all?lamin=25.0&lomin=-125.0&lamax=50.0&lomax=-65.0';
const API_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(BASE_URL);

const MOCK_FLIGHTS = [
    { icao24: "a0bc7c", callsign: "UAL123", origin_country: "United States", longitude: -74.0060, latitude: 40.7128, baro_altitude: 10500, on_ground: false, velocity: 250.5, true_track: 90, vertical_rate: 0 },
    { icao24: "c81d89", callsign: "DAL456", origin_country: "United States", longitude: -118.2437, latitude: 34.0522, baro_altitude: 11200, on_ground: false, velocity: 260.1, true_track: 270, vertical_rate: 2 },
    { icao24: "e89a11", callsign: "AAL789", origin_country: "United States", longitude: -87.6298, latitude: 41.8781, baro_altitude: 9800, on_ground: false, velocity: 240.3, true_track: 180, vertical_rate: -1 },
    { icao24: "f1b2c3", callsign: "SWA101", origin_country: "United States", longitude: -96.7970, latitude: 32.7767, baro_altitude: 10100, on_ground: false, velocity: 245.8, true_track: 360, vertical_rate: 0 },
    { icao24: "d4a5e6", callsign: "JBU202", origin_country: "United States", longitude: -80.1918, latitude: 25.7617, baro_altitude: 8500, on_ground: false, velocity: 230.4, true_track: 45, vertical_rate: -2.5 },
    { icao24: "b2f4c1", callsign: "FDX88", origin_country: "United States", longitude: -89.9712, latitude: 35.0456, baro_altitude: 12000, on_ground: false, velocity: 275.2, true_track: 120, vertical_rate: 5 }
];

window.allFlights = [];

function parseFlightData(rawStates) {
    if (!rawStates || !Array.isArray(rawStates)) return [];
    
    return rawStates.map(state => {
        return {
            icao24: state[0],
            callsign: state[1] ? state[1].trim() : "",
            origin_country: state[2],
            longitude: state[5],
            latitude: state[6],
            baro_altitude: state[7],
            on_ground: state[8],
            velocity: state[9],
            true_track: state[10],
            vertical_rate: state[11]
        };
    });
}

function initiateFlightFetch() {
    fetch(API_URL)
        .then(res => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(data => {
            if (data && data.states) {
                window.allFlights = parseFlightData(data.states);
                if (typeof window.refreshUI === 'function') {
                    window.refreshUI();
                }
            } else {
                throw new Error("No data structure found.");
            }
        })
        .catch(err => {
            window.allFlights = [...MOCK_FLIGHTS]; 
            
            if (typeof window.refreshUI === 'function') {
                window.refreshUI();
            }
        });
}

initiateFlightFetch();
