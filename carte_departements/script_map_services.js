// Fichier script.js



$(document).ready(function () {
    // Création de la carte avec Leaflet
    var map = L.map('map').setView([48.8566, 2.3522], 6); // Coordonnées de départ et niveau de zoom

    var geojsonLayer;

    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {
        layer.on({
            click: zoomToFeature
        });
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Fond de carte OpenStreetMap

    var geojsonLayer = new L.GeoJSON.AJAX("data/DEPARTEMENT.geojson", {
        onEachFeature: onEachFeature
    });  
    console.log(geojsonLayer);
    geojsonLayer.addTo(map);

});
