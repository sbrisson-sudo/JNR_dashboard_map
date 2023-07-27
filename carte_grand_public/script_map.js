// Fichier script.js

$(document).ready(function () {
    // Création de la carte avec Leaflet
    var map = L.map('map').setView([48.8566, 2.3522], 5); // Coordonnées de départ et niveau de zoom

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Fond de carte OpenStreetMap

    // Création des markers
    const riskNat_marker = L.AwesomeMarkers.icon({
        icon: 'coffee',
        markerColor: 'green'
      });
    
    const riskTEch_marker = L.AwesomeMarkers.icon({
        icon: 'coffee',
        markerColor: 'red'
      });
    
    const riskMult_marker = L.AwesomeMarkers.icon({
        icon: 'coffee',
        markerColor: 'blue'
      });

    // Chargement du fichier CSV
    $.ajax({
        url: 'data/actions_grand_public_carte.csv',
        dataType: 'text',
        success: function (data) {
            var parsedData = Papa.parse(data, { header: true, skipEmptyLines: true });
            var markers = L.markerClusterGroup(); // Utilisation du plugin Leaflet.markercluster pour regrouper les marqueurs

            var nb_actions = 0;

            // Parcours des données et création des marqueurs
            parsedData.data.forEach(function (item) {

                var lat = parseFloat(item.Lat);
                var lon = parseFloat(item.Lon);

                // Vérification si les coordonnées sont valides (pas NaN)
                if (!isNaN(lat) && !isNaN(lon)) {

                    nb_actions += 1;

                    var popupContent = '<strong>' + item.Nom + '</strong><br><em>' + item.Adresse + '</em><br>'

                    if (item.Action_JNR == "True"){
                        popupContent += "Le 13/10/2023, Journée nationale de la résilience" + '<br>'
                    } else {
                        popupContent += 'Du ' + item.Date_debut + ' au ' + item.Date_fin + '<br>'
                    }
                    
                    popupContent += item.Descriptif + '<br> <strong>Organisé par :</strong> ' + item.Organisateur + '<br><strong>Risques traités : </strong>' + item.Risques_nat + ", "+ item.Risques_techno ;

                    if ((item.Is_risque_nat=="True") && (item.Is_risque_techno=="True")) {
                        var marker = L.marker([lat, lon],{icon: riskMult_marker}).bindPopup(popupContent);
                    } else if (item.Is_risque_nat=="True") {
                        var marker = L.marker([lat, lon],{icon: riskNat_marker}).bindPopup(popupContent);
                    } else {
                        var marker = L.marker([lat, lon],{icon: riskTEch_marker}).bindPopup(popupContent);
                    }

                    markers.addLayer(marker);
                }
            });

            map.addLayer(markers); // Ajout des marqueurs à la carte

            // Ajout de la légende
            var legend = L.control({position: 'bottomleft'});

            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend');
                labels = ['<strong>Risques abordés</strong>'],

                labels.push('<i class="bi bi-circle-fill" style="color:#38a9dd"></i> Multirisque');
                labels.push('<i class="bi bi-circle-fill" style="color:#72b026"></i> Risques naturels');
                labels.push('<i class="bi bi-circle-fill" style="color:#d33d2a"></i> Risques technologiques');

                div.innerHTML = labels.join('<br>');    

                // Add class
                div.classList.add("btn");
                div.classList.add("btn-light");
                div.classList.add("text-start");

                return div;
            };
            legend.addTo(map);

            // Sélectionner l'élément avec la classe "counter-count" et mettre à jour son texte avec le nombre d'entrées
            $('.counter-count').text(nb_actions);
            
            // Appliquer l'animation de comptage comme vous l'avez précédemment défini
            $('.counter-count').each(function() {
                $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
                }, {
                    duration: 4000,
                    easing: 'swing',
                    step: function(now) {
                        $(this).text(Math.ceil(now));
                    }
                });
            });
        }
    });

    // Boutons pour changer la vue de la carte

    

    var locations = [
        { coords: [4.035282, -53.113578], zoom: 7 },   // Guyanne 
        { coords: [-21.125720, 55.535528], zoom: 9 },  // La Réunion
        { coords: [16.272048, -61.548002], zoom: 9 },  // Guadeloupe
        { coords: [14.670835, -61.009602], zoom: 10},  // Martinique
        { coords: [-12.836948, 45.155820], zoom: 10 }    // Mayotte
      ];

    $('.changeMapViewBtn').each(function(index) {
        $(this).on('click', function() {
          // Récupérez les coordonnées et le niveau de zoom associés à ce bouton en utilisant l'index de la boucle
          var location = locations[index];
          var coords = location.coords;
          var zoom = location.zoom;
    
          // Mettez à jour la vue de la carte avec les nouvelles coordonnées et le nouveau niveau de zoom
          map.setView(coords, zoom);
        });
    });


});
