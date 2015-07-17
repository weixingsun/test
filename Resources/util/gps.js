var locationAdded = false;

function handleLocation(e) {
    if (!e.error) {
        //Ti.API.info("location: "+e.coords.longitude+","+e.coords.latitude+"("+e.coords.accuracy+")   time:"+e.coords.timestamp);
	    Ti.App.Properties.setDouble("lng",e.coords.longitude);
	    Ti.App.Properties.setDouble("lat",e.coords.latitude);
	    Ti.App.Properties.setInt("heading",e.coords.heading);
	    Ti.App.Properties.setInt("accuracy",e.coords.accuracy);
	    Ti.App.Properties.setInt("speed",e.coords.speed);
	    //var altitude = e.coords.altitude;
	    //var timestamp = e.coords.timestamp;
	    //var altitudeAccuracy = e.coords.altitudeAccuracy;
	    //setTimeout(function(){ },100);
	    if(Ti.App.Properties.getInt("myCircle") !== 0){
	    	map.removeLayer(Ti.App.Properties.getInt("myCircle"));
	    }
	    if(Ti.App.Properties.getInt("mySpot") !== 0){
	    	map.removeLayer(Ti.App.Properties.getInt("mySpot"));
	    }
	    //Ti.API.info("accuracy="+e.coords.accuracy);
	    var me = [e.coords.latitude,e.coords.longitude];
	    var myCircle = map.createCircle({
			"latlng": me,
			"colorHex": "#440000FF",
			"radius": e.coords.accuracy //This is meters!
		});
		var mySpot = map.createMarker({
			"iconPath": Ti.App.Android.R.drawable.me_point_blue_1,
			"latlng": me
	    });
	    Ti.App.Properties.setInt("mySpot",mySpot.id);
	    Ti.App.Properties.setInt("myCircle",myCircle.id);
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

function initGPS(){
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
}

