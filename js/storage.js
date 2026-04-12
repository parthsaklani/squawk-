const KEY_FAVS = 'squawk_m3_favs';
const KEY_THEME = 'squawk_m3_theme';

function getStorageFavs() {
    try {
        const payload = localStorage.getItem(KEY_FAVS);
        return payload ? JSON.parse(payload) : [];
    } catch(e) {
        return [];
    }
}

function isFavStorage(icao24) {
    const list = getStorageFavs();
    return list.includes(icao24);
}

function toggleFavStorage(icao24) {
    let list = getStorageFavs();
    
    if (list.includes(icao24)) {
        list = list.filter(item => item !== icao24);
    } else {
        list.push(icao24);
    }
    
    localStorage.setItem(KEY_FAVS, JSON.stringify(list));
    return list;
}

function getStorageTheme() {
    return localStorage.getItem(KEY_THEME) || 'dark';
}

function setStorageTheme(val) {
    localStorage.setItem(KEY_THEME, val);
}
