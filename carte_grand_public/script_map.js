// Fichier script.js

var csvData;

var select_all_risque = true;
var select_all_public = true;

$(document).ready(function () {
    // Création de la carte avec Leaflet
    var map = L.map('map').setView([47, 2.3522], 6); // Coordonnées de départ et niveau de zoom
    
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Fond de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Création des markers
    const riskNat_marker = L.AwesomeMarkers.icon({
        markerColor: 'green'
      });
    
    const riskTEch_marker = L.AwesomeMarkers.icon({
        markerColor: 'red'
      });
    
    const riskMult_marker = L.AwesomeMarkers.icon({
        markerColor: 'blue'
      });

    // Chargement du fichier CSV
    $.ajax({
        url: 'data/actions_grand_public_carte.csv',
        dataType: 'text',
        success: function (data) {

            var csvData = Papa.parse(data, { header: true, skipEmptyLines: true });
            var markers = L.markerClusterGroup(); // Utilisation du plugin Leaflet.markercluster pour regrouper les marqueurs

            // // Test : on ne garde que les actions traitant d'innondation
            // var filteredRows = _.filter(csvData, function(row) {
            //     return row["est_inondations"] === "True";
            // });

            // console.log(filteredRows)
            
            var nb_actions = 0;

            // Parcours des données et création des marqueurs
            csvData.data.forEach(function (item) {
            // _.forEach(filteredRows, function (item) {
        
                // console.log(item.est_inondations);

                var lat = parseFloat(item.lat);
                var lon = parseFloat(item.lon);

                // console.log(`adding marker at ${lat},${lon}`);

                // Vérification si les coordonnées sont valides (pas NaN)
                if (!isNaN(lat) && !isNaN(lon)) {

                    nb_actions += 1;

                    var description = item.description;
                    const NB_MAX_CHAR = 800;
                    if (description.length > NB_MAX_CHAR){
                        description = description.slice(0,NB_MAX_CHAR) + "..."
                    }

                    var popupContent = '<strong>' + item.nom + '</strong><br><em>' + item.adresse + '</em><br>'
                    
                    if (item.date_debut == item.date_fin) {
                        if (item.date_debut == "2023-10-13") {
                            popupContent += "Le 13/10/2023, Journée nationale de la résilience" + '<br>'
                        } else {
                            popupContent += "Le " + item.date_debut + '<br>'
                        }
                    } else {
                        popupContent += 'Du ' + item.date_debut + ' au ' + item.date_fin + '<br>'
                    }
                    
                    popupContent += '<strong>Organisé par :</strong> ' + item.organisateur + '<br><strong>Risques traités : </strong>' + item.risques_naturels + ", "+ item.risques_technologiques ;

                    if ((item.est_risques_naturels=="True") && (item.est_risques_technologiques=="True")) {
                        var marker = L.marker([lat, lon],{icon: riskMult_marker}).bindPopup(popupContent);
                    } else if (item.est_risques_naturels=="True") {
                        var marker = L.marker([lat, lon],{icon: riskNat_marker}).bindPopup(popupContent);
                    } else {
                        var marker = L.marker([lat, lon],{icon: riskTEch_marker}).bindPopup(popupContent);
                    }

                    markers.addLayer(marker);

                    // console.log(`marker added at ${lat},${lon}`);
                    // console.log(`Action ${item.nom} : lat or lon is not nan`);
                } else {
                    // console.log(`Action ${item.nom} : lat or lon is nan`);
                }
            });

            map.addLayer(markers); // Ajout des marqueurs à la carte

            // Ajout de la légende
            var legend = L.control({position: 'bottomleft'});

            legend.onAdd = function (map) {

                var div = L.DomUtil.create('div', 'info legend');
                labels = ['<strong>Risques abordés</strong>'],

                labels.push('<i class="bi bi-circle-fill" style="color:#38a9dd"></i> Multirisques');
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

            console.log(`${nb_actions} actions dénombrées`)

            // Sélectionner l'élément avec la classe "counter-count" et mettre à jour son texte avec le nombre d'entrées
            $('.counter-count').text(nb_actions);
            
            // Appliquer l'animation de comptage comme vous l'avez précédemment défini
            $('.counter-count').each(function() {
                $(this).prop('Counter', 0).animate({
                Counter: $(this).text()
                }, {
                    duration: 2000,
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
        { coords: [-12.836948, 45.155820], zoom: 10 },    // Mayotte
        { coords: [-21.405677, 165.531372], zoom: 8 },    // Nouvelle caledonie
        { coords: [46.954482, -56.327337], zoom: 10 },    // St pierre et miquelon
        { coords: [47, 2.3522], zoom: 6 }    // Métropole
      ];

    var domtom_dptcodes = [
        "973", // Guyane
        "974", // La Réunion
        "971", // La Guadeloupe
        "972", // Martinique
        "976", // Mayotte
    ]


    $('.changeMapViewBtn').each(function(index) {
        $(this).on('click', function() {
          // Récupérez les coordonnées et le niveau de zoom associés à ce bouton en utilisant l'index de la boucle
          var location = locations[index];
          var coords = location.coords;
          var zoom = location.zoom;
    
          // Mettez à jour la vue de la carte avec les nouvelles coordonnées et le nouveau niveau de zoom
          map.setView(coords, zoom);

          // Si il s'agit d'un dom tom on met aussi à jour les stats départementales
          if (index < domtom_dptcodes.length) {
            update_plot_nb_actions(domtom_dptcodes[index]);
            update_dpt_button(domtom_dptcodes[index]);
          }
        });
    });

    // Fonction retournant les coordonnées lat lon à partir d'une adresse
    async function address2coordinates(address) {

        let url = `https://nominatim.openstreetmap.org/?adressdetails=1&q=${address.replaceAll(' ','+')}&format=json&limit=1`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error("Erreur lors de la récupération des données.");
            }
        
            const data = await response.json();

            if (data[0] === "undefined") {
                throw new Error("Adresse invalide.");
            }

            // console.log(data[0])

            const latitude = data[0].lat;
            const longitude = data[0].lon;
        
            return { latitude, longitude };
          } catch (error) {
            console.error("Erreur :", error.message);
            return null; // Ou vous pouvez renvoyer une valeur par défaut ou gérer l'erreur selon vos besoins.
          }
    }

    // Fonction retournant le département contenant des coordonnées
    async function getDepartmentFromCoordinates(latitude, longitude) {

        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
      
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données.");
        }
        
        var department;
        const data = await response.json();
    
        // Récupérer le nom du département à partir des données renvoyées par l'API
        /*
        Pour les départements de l'Hexagone / de la Corse , l'API renvoie dans le champ "adress" un champ ​"ISO3166-2-lvl6" contenant l'information du département (ex : "FR-38")
        Pour les DOM/TOM, le champ "adress" ne contient pas de champ ​"ISO3166-2-lvl6" main un champ ​"ISO3166-2-lvl4" contenant l'identifiant INSEE_DEP (ex : "FR-973")
        */

        // Récupération des départements hexagone + corse
        if ("ISO3166-2-lvl6" in data.address) {
            department = data.address["ISO3166-2-lvl6"];
            if (department.slice(0,2) ==  "FR") {
                return department.split("-")[1];
            }
        }

        // Récupération des départements outre mer
        if ("ISO3166-2-lvl4" in data.address) {
            department = data.address["ISO3166-2-lvl4"];
            if (department.slice(0,2) ==  "FR") {
                return department.split("-")[1];
            }
        }

        // Apparement pas en France
        console.log(data);
        throw new Error("Erreur lors de la récupération du département.")

      }

    // Fonction pour centrer la carte sur les coordonnées données et ajuster le niveau de zoom
    function centerMap(map, latitude, longitude, distance) {
        // console.log(`Centering map on lat=${latitude} lon=${longitude} (distance=${distance}) `);
        map.setView([latitude, longitude], getZoomLevel(distance));
    }
    
    // Fonction pour calculer le niveau de zoom en fonction de la distance choisie
    function getZoomLevel(distance) {
        if (distance <= 10000) {
        return 12;
        } else if (distance <= 20000) {
        return 11;
        } else if (distance <= 50000) {
        return 10;
        } else {
        return 9;
        }
    }

    // Fonction pour gérer la soumission du formulaire
    async function onSubmitForm(event) {

        event.preventDefault();
    
        var address = document.getElementById('addressInput').value;
        var distance = parseInt(document.getElementById('distanceSelect').value, 10);

        let latitude;
        let longitude;
        let dpt_code;

        try {
            const coordinates = await address2coordinates(address);
            if (!coordinates) {
                // Afficher le message d'erreur si les coordonnées sont null
                document.getElementById('error-message').innerText = 'Adresse invalide.';
                return ;
            } else {
                ({ latitude, longitude } = coordinates);
                document.getElementById('error-message').innerText = ''; // Effacer le message d'erreur s'il était affiché
            }
        } catch (error) {
            console.error("Erreur :", error.message);
            // Afficher un message d'erreur général en cas d'erreur lors de la requête
            document.getElementById('error-message').innerText = 'Une erreur est survenue lors de la récupération des données.';
            return ;
        }

        try {
            dpt_code = await getDepartmentFromCoordinates(latitude, longitude);
            console.log(dpt_code);
        } catch (error) {
            console.error("Erreur :", error.message);
            document.getElementById('error-message').innerText = "L'adresse entrée apparaît en dehors du territoire français";
            return ;
        }

        // Mise à jour de la carte
        centerMap(map, latitude, longitude, distance);

        // Affichage de l'adresse entrée par l'utilisateur
        const myPosition_marker = L.AwesomeMarkers.icon({
            icon: 'coffee',
            markerColor: 'black'
          });        

        // var marker = L.marker([latitude, longitude],{icon: myPosition_marker});
        // map.addLayer(marker);
        

        // Mise à jour des statistiques départementales
        update_plot_nb_actions(dpt_code);
        update_dpt_button(dpt_code);
    }
    
    // Attacher la fonction onSubmitForm à l'événement submit du formulaire
    document.getElementById('locationForm').addEventListener('submit', onSubmitForm);


    // form de filtrage des actions
    async function onSubmitFilterForm(event) {

        event.preventDefault();

        // Récupérer les valeurs sélectionnées des checkboxes
        const checkboxValues = {};
        const checkboxList = $('#filterForm input[type="checkbox"]');
        checkboxList.each(function() {
            checkboxValues[this.id] = this.checked;
        });

    }

    // Attacher la fonction onSubmitForm à l'événement submit du formulaire
    document.getElementById('filterForm').addEventListener('submit', onSubmitFilterForm);


    
    // bouttons tout selectionner / deselectionner
    $("#deselect_risques").click(function() {

        if (select_all_risque) {
            // Changer le texte du bouton
            $(this).text("Tout sélectionner");
            // Changer les cases à cocher à unchecked
            $("#select_risques_form input[type='checkbox']").prop("checked", false);
            // Changer la valeur de la variable globale 
            select_all_risque = false
        } else {
            $(this).text("Tout désélectionner");
            $("#select_risques_form input[type='checkbox']").prop("checked", true);
            select_all_risque = true
        }
            
    });

    $("#deselect_publics").click(function() {

        if (select_all_risque) {
            // Changer le texte du bouton
            $(this).text("Tout sélectionner");
            // Changer les cases à cocher à unchecked
            $("#select_publics_form input[type='checkbox']").prop("checked", false);
            // Changer la valeur de la variable globale 
            select_all_risque = false
        } else {
            $(this).text("Tout désélectionner");
            $("#select_publics_form input[type='checkbox']").prop("checked", true);
            select_all_risque = true
        }
            
    });
    

        
    





});
