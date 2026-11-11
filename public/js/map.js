
mapboxgl.accessToken = window.mapToken;

const coordinates = window.coordinates;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: coordinates,
    zoom: 12
});

const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <h4>${window.listingLocation}</h4>
            <p>${window.listingCountry}</p>
            <p>Exact Location after booking</p>
        `)
    )
    .addTo(map);

marker.togglePopup();
