mapboxgl.accessToken = window.mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: window.coordinates,
    zoom: 12
});

const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(window.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h4>${listing.location}</h4>
            <p>${listing.country}</p>
            <p>Exact location of your stay</p>
        `)
    )
    .addTo(map);

// Automatically open the popup
marker.togglePopup();