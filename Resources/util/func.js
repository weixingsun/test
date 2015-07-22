function test(){
/*
Ti.App.Properties.setList('all_things',all_things_dictionary);
var arr = Ti.App.Properties.getList('all_things');
arr.PolyLine["route"].value = 'it works!';
// This works
Ti.API.info('first route: ' + arr.PolyLine["route"].value);

// save changes to property list
Ti.App.Properties.setList('all_things',arr);

// This doesn't work
Ti.API.info('first route: ' + Ti.App.Properties.getList('all_things').PolyLine["route"].value);

mapView.createMarker({
	"iconPath": "/images/marker_tap.png",
	"latlng": [e.lat, e.lng]
  });
//mapView.centerLatlng = [-43.524551, 172.58346];
//mapView.zoomLevel = 12;
mapView.addLayer({
	"name": "osm",
	"url": "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	"subdomains": ["a", "b"],
	"parallelRequests": 4,
	"maxZoom": "20",
	"minZoom": "4"
});

//Ti.include('marker.js');

//Ti.API.info('Created polyline: ' + JSON.stringify(polyline));
polyline.color = "red";
polyline = mapView.updateLayer(polyline);
//Note, that your previous reference is invalid and has
//to be replaced with the new one returned from updateLayer()
//Ti.API.info('Updated polyline to: ' + JSON.stringify(polyline));

//Draw a green polygon with a thick black stroke
var plgId = mapView.createPolygon({
	"latlngs": [
		[-43.524551, 172.58346],
		[-43.524551, 172.60346],
		[-43.544551, 172.60346],
		[-43.544551, 172.58346],
		[-43.524551, 172.58346]
	], 
	"fillColor": "green",
	"strokeColor": "black",
	"strokeWidth": 5}
);
//Draw a marker at the same position as above but with offset
mapView.createMarker({
	"iconPath": "http://www.google.com/mapfiles/dd-start.png",
	"latlng": [-43.524551, 172.58346],
	"hOffset": 5,
	"vOffset": 4
	});


//Draw a sized marker (of the Zuck) Original icon is 100x99 pixels
//temporary broken: since read from file to inputstream method not implemented in module: ti.mapsforge
mapView.createMarker({
	"iconPath": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/202896_4_1782288297_s.jpg",
	"latlng": [-43.529551, 172.63346],
	"iconSize": [64, 64] //New size in pixels
});

//Draw a circle

mapView.createCircle({
	"latlng": [-43.529551, 172.63346],
	"fillColor": "blue",
	"strokeColor": "red",
	"radius": 500 //This is meters!
});

function GetLastKnownGPS(){
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
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
	});
}


if (Ti.Geolocation.locationServicesEnabled) {
    Ti.Geolocation.purpose = 'Get Current Heading';
    // make a single request for the current heading
    Ti.Geolocation.getCurrentHeading(function(e) {
        Ti.API.info(e.heading);
    });
    // Set 'heading' event for continual monitoring
    Ti.Geolocation.addEventListener('heading', function(e) {
        if (e.error) {
            alert('Error: ' + e.error);
        } else {
            Ti.API.info(e.heading);
        }
    });
}

*/
}

/*
function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}
*/