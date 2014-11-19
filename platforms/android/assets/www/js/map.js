function initMap(){
    loadMap();
}

var lat, lon, map;

function loadMap() {
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError, {timeout: 10000, enableHighAccuracy: true});
    //map = new google.maps.Map(document.getElementById("map"), mapoptions);

    function onGeoSuccess(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        var currentposition = new google.maps.LatLng(lat, lon);

        var mapoptions = {
            zoom: 12,
            center: currentposition,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map"), mapoptions);
        var marker = new google.maps.Marker({
            position: currentposition,
            map: map,
            icon: 'img/marker.png'
        });

        google.maps.event.trigger(map, 'resize');
        map.setCenter(currentposition);

        stationMarkers();
    }

    function onGeoError(error) {
        alert(error.message);
        if (error == 1) {
            alert('turn on geolocation');
        }
    }
}

function stationMarkers(){
    //alert("getting stations")
    $.get("http://nipuna.me/train-admin/php/getstations.json.php", function (data) {
        var markerTemplate = ($('#mapMarker').html())
        var stations = jQuery.parseJSON(data);

        $.each(stations, function (index, station) {
            //alert( stations[index].station_name);
            //alert(station.station_name);

            var myLatlng = new google.maps.LatLng(station.station_lat, station.station_lon);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: station.station_name
            });

            //var template = "<li>{{station_name}}</li>";
            var info = Mustache.to_html(markerTemplate, station);

            var contentString = '<div style="width: 250px;color: rgba(3, 0, 74, 0.99);font-size:20px;font-family:Arial, Helvetica, sans-serif;">' + station.station_name + '<br/>' + station.station_lat + '<br/>' + station.station_lon + '<br/>' + station.station_prev + '</div>';
            contentString = info;

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            google.maps.event.addListener(marker, 'click', function () {
                //infowindow.close(map,markerPrev);
                infowindow.open(map, marker);
                markerPrev = marker;
            });
        });
    });
}