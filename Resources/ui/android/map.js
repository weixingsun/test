var ALL = {
	Marker:{"dest":0},
	Gps:{"lat":0,"lng":0,"heading":0,"accuracy":0,"speed":0},
	Line:{"route":0},
	Nodes:{}
};

var win = Ti.UI.createWindow({
	backgroundColor:'white'
});
var mf = require('ti.mapsforge');
mf.load("/osmdroid/maps/nz/");
var mapView = mf.createMapsforgeView({
 "scalebar": true,
 "minZoom": 5, //Min zoom level for map view
 "maxZoom": 20, //Max zoom level for map view
 "centerLatlng": [-43.524551, 172.58346], //locke
 "zoomLevel": 12, //Bogus initial zoom level
 "debug": false });

win.add(mapView);
win.open();
Ti.API.info('mapView: ' + JSON.stringify(mapView));

Ti.App.addEventListener('clicked', function(e) {
	var resid = Ti.App.Android.R.drawable.marker_tap;
	alert('clicked('+e.lat+','+e.lng+')');
  /*mapView.createMarker({
	"iconPath": "/images/marker_tap.png",
	"latlng": [e.lat, e.lng]
  });*/
});
Ti.App.addEventListener('longclicked', function(e) {
	Ti.API.info('longclicked('+e.lat+','+e.lng+')');
	var from = [-43.524551, 172.58346];
	var to = [e.lat,e.lng];
	navi(from,to);
	marker(to);
});
//mapView.centerLatlng = [-43.524551, 172.58346];
//mapView.zoomLevel = 12;
/*mapView.addLayer({
	"name": "osm",
	"url": "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
	"subdomains": ["a", "b"],
	"parallelRequests": 4,
	"maxZoom": "20",
	"minZoom": "4"
});
*/
 mapView.addLayer({
	"name": "osm",
	"path": "osmdroid/maps/nz/nz.map",
});

var actionBar = win.activity.actionBar;
if(typeof actionBar != 'undefined'){
	actionBar.hide();
}

function removePrevDestMarker(){
	var pre_marker = ALL.Marker["dest"];
	if(pre_marker!==0){
		mapView.removeLayer(pre_marker);
	}
}
function marker(to){
	//platform/android/res/drawable/marker_tap.png
	var dest = mapView.createMarker({
		"iconPath": Ti.App.Android.R.drawable.marker_tap,
		"latlng": to
    });
    ALL.Marker["dest"]=dest.id;
}
function navi(from,to){
	var args = {
	 "weighting": "fastest",	//fast/short
	 "vehicle":   "car",		//walk/bicycle/bus
	 "from": from, //locke
	 "to":   to, //home
	 "debug": false
	};
	mf.getRouteAsyncCallback(args,function(data){
		if(data.error==0){
			var pre_line = ALL.Line["route"];
			if(pre_line!==0){
				mapView.removeLayer(pre_line);
			}
			var line = mapView.createPolyline({
				"latlngs": data.pts,
				"color": "blue",
				"strokeWidth": 10
				});
			ALL.Line["route"]=line.id;
			//Ti.API.info("test: nodes.size()="+data.nodes.length+",node0.sign="+data.nodes[0].sign+",node0.name="+data.nodes[0].name+",node0.pts="+data.nodes[0].pts);
			ALL.Nodes=data.nodes;
		}
	});
}

//Ti.include('marker.js');
/*
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
//Ti.API.info('Created polyline: ' + JSON.stringify(polyline));
polyline.color = "red";
polyline = mapView.updateLayer(polyline);
//Note, that your previous reference is invalid and has
//to be replaced with the new one returned from updateLayer()
//Ti.API.info('Updated polyline to: ' + JSON.stringify(polyline));

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
*/
//Draw a circle
/*
mapView.createCircle({
	"latlng": [-43.529551, 172.63346],
	"fillColor": "blue",
	"strokeColor": "red",
	"radius": 500 //This is meters!
});

 * 
 * */