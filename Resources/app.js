var foo = Titanium.Network.createHTTPClient();
var win = Ti.UI.createWindow({
	backgroundColor:'white'
});

var mf = require('sc.mapsforge');

var mapView = mf.createMapsforgeView({
	"scalebar": true,
	"minZoom": 12, //Min zoom level for map view
	"maxZoom": 18,  //Max zoom level for map view
	"centerLatlng": [-43.524551, 172.58346], //locke
	"zoomLevel": 17, //Bogus initial zoom level
	"debug": true });
win.add(mapView);
win.open();
Ti.API.info('mapView: ' + JSON.stringify(mapView));
//Set center and zoom level on map view using properties
mapView.centerLatlng = [-43.524551, 172.58346]; //Center at Zell am See
mapView.zoomLevel = 12;

mapView.addLayer({
	"name": "osm",
	"url": "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	"subdomains": ["a", "b"],
	"parallelRequests": 2,
	"maxZoom": "20",
	"minZoom": "10"
});

//Draw a blue line on the map...
var polyline = mapView.createPolyline({
	"latlngs": [
		[-43.524551, 172.58346],
		[-43.524551, 172.59346],
		[-43.534551, 172.58346]
	], 
	"color": "blue",
	"strokeWidth": 5
});
Ti.API.info('Created polyline: ' + JSON.stringify(polyline));
//..and change its color to red...
polyline.color = "red";
//...and then update the layer.
polyline = mapView.updateLayer(polyline);
//Note, that your previous reference is invalid and has
//to be replaced with the new one returned from updateLayer()
Ti.API.info('Updated polyline to: ' + JSON.stringify(polyline));

//Draw a green polygon with a thick black stroke
mapView.createPolygon({
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

//Draw a marker
mapView.createMarker({
	"iconPath": "http://www.google.com/mapfiles/marker.png",
	"latlng": [-43.524551, 172.58346]
});
	
//Draw a marker at the same position as above but with offset
mapView.createMarker({
	"iconPath": "http://www.google.com/mapfiles/dd-start.png",
	"latlng": [-43.524551, 172.58346],
	"hOffset": 5,
	"vOffset": 4
	});
/*
//Draw a sized marker (of the Zuck) Original icon is 100x99 pixels
mapView.createMarker({
	"iconPath": "https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/202896_4_1782288297_s.jpg",
	"latlng": [-43.529551, 172.63346],
	"iconSize": [64, 64] //New size in pixels
});
*/
//Draw a circle
mapView.createCircle({
	"latlng": [-43.529551, 172.63346],
	"fillColor": "blue",
	"strokeColor": "red",
	"radius": 500 //This is meters!
});
