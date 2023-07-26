// Fichier script.js
$(document).ready(function () {
    // Création de la carte avec Leaflet
    var map = L.map('map').setView([48.8566, 2.3522], 6); // Coordonnées de départ et niveau de zoom

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Fond de carte OpenStreetMap

    // Chargement du fichier CSV
    $.ajax({
        url: 'data/coordonnées_actions.csv',
        dataType: 'text',
        success: function (data) {
            var parsedData = Papa.parse(data, { header: true, skipEmptyLines: true });
            var markers = L.markerClusterGroup(); // Utilisation du plugin Leaflet.markercluster pour regrouper les marqueurs

            // Parcours des données et création des marqueurs
            parsedData.data.forEach(function (item) {

                console.log(lat, lon);

                var lat = parseFloat(item.lat);
                var lon = parseFloat(item.lon);

                // Vérification si les coordonnées sont valides (pas NaN)
                if (!isNaN(lat) && !isNaN(lon)) {
                    var popupContent = '<strong>' + item.Intitule + '</strong><br>' + item.Adresse + '<br>' + item.Description + '<br> <strong>Organisé par :</strong> ' + item.Organisateur;
                    var marker = L.marker([lat, lon]).bindPopup(popupContent);
                    markers.addLayer(marker);
                }
            });

            map.addLayer(markers); // Ajout des marqueurs à la carte
        }
    });
});
