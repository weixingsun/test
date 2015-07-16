//ALL.Gps:{"lat":0,"lng":0,"heading":0,"accuracy":0,"speed":0}
//Ti.App.Properties.setString('PosType','gps');
//Ti.App.Properties.setObject();
//Ti.App.Properties.setList();

initGPS();
function initGPS(){
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.distanceFilter = 10;
	Ti.Geolocation.getCurrentPosition(function(e){
	    if (!e.success || e.error){
	        alert('error ' + JSON.stringify(e.error));
	        return;
	    }
	    ALL.Gps["lng"] = e.coords.longitude;
	    ALL.Gps["lat"] = e.coords.latitude;
	    ALL.Gps["heading"] = e.coords.heading;
	    ALL.Gps["accuracy"] = e.coords.accuracy;
	    ALL.Gps["speed"] = e.coords.speed;
	    var altitude = e.coords.altitude;
	    var timestamp = e.coords.timestamp;
	    var altitudeAccuracy = e.coords.altitudeAccuracy;
	});
	Ti.Geolocation.addEventListener('location', locationCallback);
}

 
function locationCallback(e){
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
	//reverseGeoNet(latitude,longitude);
};
function reverseGeoNet(latitude,longitude){
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