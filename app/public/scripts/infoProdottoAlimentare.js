$(document).ready( () => {
    var nomeFileZDP = $('#nomeFileZonaDiProduzione').val()

    $.ajax({
        url: 'http://localhost:8080/assets/zone_di_produzione/' + nomeFileZDP,
    }).done(function(data){
        var map = L.map('map')

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        var styleJsonLayer = {
            "weight": 3,
            "opacity": 0.7,
            "fillOpacity": 0.4
        }

        var jsonLayer = L.geoJSON(data, {style: styleJsonLayer}).addTo(map)

        map.fitBounds(jsonLayer.getBounds())
        map.setZoom(map.getZoom() - 1)
   })
})