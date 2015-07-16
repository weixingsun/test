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
    }
};

function addHandler() {
    if (!locationAdded) {
        Ti.Geolocation.addEventListener('location', handleLocation);
        locationAdded = true;
    }
};
function removeHandler() {
    if (locationAdded) {
        Ti.Geolocation.removeEventListener('location', handleLocation);
        locationAdded = false;
    }
};

Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
//Ti.Geolocation.distanceFilter = 10; //drop event accuracy >10m
//Titanium.Geolocation.frequency = 2000;
Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
if (Ti.Geolocation.locationServicesEnabled) {
    addHandler();
    var activity = Ti.Android.currentActivity;
    activity.addEventListener('destroy', removeHandler);
    activity.addEventListener('pause', removeHandler);
    activity.addEventListener('resume', addHandler);
} else {
    alert('Please enable location services');
}
