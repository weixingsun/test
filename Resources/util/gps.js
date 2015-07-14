var longitude;
var latitude;
var heading;
var accuracy;
var speed;
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 10;
Ti.Geolocation.getCurrentPosition(function(e){
    if (!e.success || e.error){
        alert('error ' + JSON.stringify(e.error));
        return;
    }
    longitude = e.coords.longitude;
    latitude = e.coords.latitude;
    heading = e.coords.heading;
    accuracy = e.coords.accuracy;
    speed = e.coords.speed;
    var altitude = e.coords.altitude;
    var timestamp = e.coords.timestamp;
    var altitudeAccuracy = e.coords.altitudeAccuracy;
});
 
var locationCallback = function(e){
    if (!e.success || e.error){ return; }
    
    var longitude = e.coords.longitude;
    var latitude = e.coords.latitude;
    var altitude = e.coords.altitude;
    var heading = e.coords.heading;
    var accuracy = e.coords.accuracy;
    var speed = e.coords.speed;
    var timestamp = e.coords.timestamp;
    var altitudeAccuracy = e.coords.altitudeAccuracy;
 
    setTimeout(function(){ },100);
	reverseGEO(latitude,longitude);
 
};
function reverseGEO(latitude,longitude){
	Ti.Geolocation.reverseGeocoder(latitude,longitude,function(evt){
        if (evt.success) {
            var places = evt.places;
            if (places && places.length) {
                //reverseGeo.text = places[0].address;
                var place = places[0].address;
                //alert("Current location "+place);
            } else {
                //reverseGeo.text = "No address found";
                alert("No address found");
            }
            Ti.API.info("reverse geolocation result = "+JSON.stringify(evt));
        }
        else {
        }
    });
}
Ti.Geolocation.addEventListener('location', locationCallback);