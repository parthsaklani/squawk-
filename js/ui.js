let currentSearchTerm = '';
let currentPage = 1;
const PER_PAGE = 50;

function debounce(fn, delay = 300) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

function processAndRenderUI() {
    let activeData = window.allFlights || [];

    const filterCriteria = {
        country: document.getElementById('filter-country').value,
        altitudeBand: document.getElementById('filter-altitude').value,
        onlyAirborne: document.getElementById('filter-airborne').checked
    };
    activeData = filterFlights(activeData, filterCriteria);

    activeData = searchFlights(activeData, currentSearchTerm);

    const sortBy = document.getElementById('sort-by').value;
    const sortOrder = document.querySelector('input[name="sort-order"]:checked').value;
    activeData = sortFlights(activeData, sortBy, sortOrder);

    const totalPages = Math.max(1, Math.ceil(activeData.length / PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    
    document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages} (${activeData.length} total)`;
    document.getElementById('btn-prev').disabled = currentPage === 1;
    document.getElementById('btn-next').disabled = currentPage === totalPages;

    const renderList = paginateFlights(activeData, currentPage, PER_PAGE);

    renderFlightList(renderList);
    
    if (typeof window.updateMapMarkers === 'function') {
        window.updateMapMarkers(activeData); 
    }
}

function renderFlightList(flights) {
    const container = document.getElementById('flight-list');
    container.innerHTML = ''; 
    
    if (flights.length === 0) {
        container.innerHTML = '<div class="no-results">No flights match criteria.</div>';
        return;
    }

    flights.forEach(f => {
        const isFav = isFavStorage(f.icao24);
        const card = document.createElement('div');
        card.className = `f-card ${isFav ? 'fav-active' : ''}`;
        
        let altitude = f.baro_altitude !== null ? `${Math.round(f.baro_altitude)}m` : 'N/A';
        let speed = f.velocity !== null ? `${Math.round(f.velocity * 3.6)}km/h` : 'N/A';

        card.innerHTML = `
            <div class="f-header">
                <div>
                     <h3>${f.callsign ? f.callsign.trim() : 'UNKNOWN'}</h3>
                     <span>${f.origin_country || 'Unknown'}</span>
                </div>
                <button class="fav-btn" data-id="${f.icao24}">${isFav ? '♥' : '♡'}</button>
            </div>
            <div class="f-details">
                <div>Airborne: <strong style="color: ${f.on_ground ? 'red' : '#3fb950'}">${f.on_ground ? 'No' : 'Yes'}</strong></div>
                <div>Alt: <strong>${altitude}</strong></div>
                <div>Spd: <strong>${speed}</strong></div>
            </div>
        `;
        
        card.querySelector('.fav-btn').addEventListener('click', (e) => {
            toggleFavStorage(e.target.dataset.id);
            processAndRenderUI(); 
        });

        container.appendChild(card);
    });
}

function populateCountryDropdown() {
    const select = document.getElementById('filter-country');
    const existingVal = select.value;
    
    select.innerHTML = '<option value="all">All Countries</option>';
    
    const distinctCountries = getUniqueCountries(window.allFlights || []);
    
    distinctCountries.forEach(cty => {
        const opt = document.createElement('option');
        opt.value = cty;
        opt.textContent = cty;
        select.appendChild(opt);
    });
    
    select.value = existingVal || 'all'; 
}

document.addEventListener('DOMContentLoaded', () => {
    
    const elementsToTriggerRefresh = [
        'filter-country', 'filter-altitude', 'filter-airborne', 'sort-by'
    ];
    elementsToTriggerRefresh.forEach(id => {
        document.getElementById(id).addEventListener('change', () => {
            currentPage = 1; 
            processAndRenderUI();
        });
    });
    
    document.querySelectorAll('input[name="sort-order"]').forEach(radio => {
        radio.addEventListener('change', () => { processAndRenderUI(); });
    });

    document.getElementById('search-input').addEventListener('input', debounce((e) => {
        currentSearchTerm = e.target.value;
        currentPage = 1;
        processAndRenderUI();
    }, 350));

    document.getElementById('btn-prev').addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; processAndRenderUI(); }
    });
    
    document.getElementById('btn-next').addEventListener('click', () => {
        currentPage++; processAndRenderUI(); 
    });

    const isDark = getStorageTheme() === 'dark';
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
    
    document.getElementById('theme-toggle').addEventListener('click', () => {
        const isCurrentDark = document.body.className === 'dark-theme';
        document.body.className = isCurrentDark ? 'light-theme' : 'dark-theme';
        setStorageTheme(isCurrentDark ? 'light' : 'dark');
    });

    window.refreshUI = function() {
        populateCountryDropdown();
        processAndRenderUI();
        document.getElementById('loading').style.display = 'none'; 
    };

    if (window.allFlights && window.allFlights.length > 0) {
        window.refreshUI();
    }
});
