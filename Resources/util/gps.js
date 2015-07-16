//ALL.Gps:{"lat":0,"lng":0,"heading":0,"accuracy":0,"speed":0}
//Ti.App.Properties.setString('PosType','gps');
//Ti.App.Properties.setObject();
//Ti.App.Properties.setList();

var locationAdded = false;

function handleLocation(e) {
    if (!e.error) {
        //Ti.API.info("location: "+e.coords.longitude+","+e.coords.latitude+"("+e.coords.accuracy+")   time:"+e.coords.timestamp);
	    ALL.Gps["lng"] = e.coords.longitude;
	    ALL.Gps["lat"] = e.coords.latitude;
	    ALL.Gps["heading"] = e.coords.heading;
	    ALL.Gps["accuracy"] = e.coords.accuracy;
	    ALL.Gps["speed"] = e.coords.speed;
	    //var altitude = e.coords.altitude;
	    //var timestamp = e.coords.timestamp;
	    //var altitudeAccuracy = e.coords.altitudeAccuracy;
	    //setTimeout(function(){ },100);
	    if(ALL.Marker["me"] !== 0){
	    	map.removeLayer(ALL.Marker["me"]);
	    }
	    Ti.API.info("accuracy="+e.coords.accuracy);
	    
	    var me = map.createCircle({
			"latlng": [e.coords.latitude, e.coords.longitude],
			"colorHex": "#440000FF",
			"radius": e.coords.accuracy //This is meters!
		});
		ALL.Marker["me"]=me.id;
    }
};

function addHandler() {
    if (!locationAdded) {
		Ti.API.info("setup gps handler 2");
        Ti.Geolocation.addEventListener('location', handleLocation);
        locationAdded = true;
    }
};
function removeHandler() {
    if (locationAdded) {
		Ti.API.info("removeHandler gps");
        Ti.Geolocation.removeEventListener('location', handleLocation);
        locationAdded = false;
    }
};

Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
Ti.Geolocation.distanceFilter = 100; //drop event accuracy >100m
//Titanium.Geolocation.frequency = 2000;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
if (Ti.Geolocation.locationServicesEnabled) {
	Ti.API.info("setup gps handler 1");
    addHandler();
    //var activity = Ti.Android.currentActivity;
    //activity.addEventListener('destroy', removeHandler);
    //activity.addEventListener('pause', removeHandler);
    //activity.addEventListener('resume', addHandler);
} else {
    alert('Please enable location services');
}
