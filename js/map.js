let mapContext = null;
let markersLayer = null;

function initLeafletMap() {
    mapContext = L.map('map').setView([39.8283, -98.5795], 4);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(mapContext);

    markersLayer = L.layerGroup().addTo(mapContext);
}

window.updateMapMarkers = function(filteredFlights) {
    if (!mapContext) {
        initLeafletMap();
    }
    
    markersLayer.clearLayers();

    filteredFlights.forEach(flight => {
        if (flight.latitude !== null && flight.longitude !== null) {
            
            const vectorStyles = {
                radius: 6,
                fillColor: '#3fb950',
                color: '#ffffff',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            const marker = L.circleMarker([flight.latitude, flight.longitude], vectorStyles);
            
            const spd = flight.velocity !== null ? `${Math.round(flight.velocity * 3.6)} km/h` : 'N/A';
            const alt = flight.baro_altitude !== null ? `${Math.round(flight.baro_altitude)} m` : 'N/A';
            const heading = flight.true_track !== null ? `${Math.round(flight.true_track)}°` : 'N/A';

            marker.bindPopup(`
                <div style="font-family: inherit;">
                    <div style="font-weight: 700; font-size: 1.1rem; color: #161b22; margin-bottom: 2px;">
                        ${flight.callsign || 'UNKNOWN'}
                    </div>
                    <div style="color: #666; font-size: 0.85rem; margin-bottom: 5px;">
                        ${flight.origin_country || 'Unknown'}
                    </div>
                    <div style="font-size: 0.85rem;">
                        <strong>Alt:</strong> ${alt}<br>
                        <strong>Speed:</strong> ${spd}<br>
                        <strong>Hdg:</strong> ${heading}
                    </div>
                </div>
            `);
            
            marker.addTo(markersLayer);
        }
    });
};
