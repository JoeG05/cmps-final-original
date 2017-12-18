let map;

$(document).ready(function() {
    $("tr").not(":first").hover(function(){
        $(this).css("background-color", "white");
    }, function() {
        $(this).css("background-color", "");
    });

    $("tr").not(":first").click(function() {
        var lat = parseFloat($(this).find("td.lat").text());
        var lng = parseFloat($(this).find("td.lng").text());
        map.setCenter({
            lat: lat, 
            lng: lng
        })
    })

    
});

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 40.7570877, lng: -73.8458213},
        zoom: 15
    });
    addMarker();
}

function addMarker() {
    
    var lat = [];
    var lng = [];
    var name = [];
    var address = [];
    var email = [];
    var phone = [];

    $("tr").find("td.name").each(function(index) {
        name.push($(this).text());
    });

    $("tr").find("td.email").each(function(index) {
        email.push($(this).text());
    });

    $("tr").find("td.phone").each(function(index) {
        phone.push($(this).text());
    });

    $("tr").find("td.address").each(function(index) {
        address.push($(this).text());
    });

    $("tr").find("td.lat").each(function(index) {
        lat.push(parseFloat($(this).text()));
    });

    $("tr").find("td.lng").each(function(index) {
        lng.push(parseFloat($(this).text()));
    });
    
    lat.forEach(function(x, index, array) {
        var myLatLng = new google.maps.LatLng(x, lng[index]);
        var marker = new google.maps.Marker({
            map: map,
            position: myLatLng
        });
        var content = "<h3>" + name[index] + "</h3>" + 
            "<p>" + address[index] + "</p>" +
            "<p>" + phone[index] + "</p>" +
            "<p>" + email[index] + "</p>";
        var infowindow = new google.maps.InfoWindow({
            content: content
        });
        marker.addListener("click", function() {
            infowindow.open(map, marker);
            console.log(content);
        });
        marker.addListener("mouseover", function() {
            infowindow.open(map, marker);
        });
        marker.addListener("mouseout", function() {
            infowindow.close();
        });
    });
}
