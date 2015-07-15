var ALL = initVar();
var win = initWindow();
var mf = initModule();
var map = initMap(win,mf);
initNav(mf);
addListeners();
addOfflineMapLayer(map);
hideBar(win);

function initWindow(){
	return Ti.UI.createWindow();
}
function initModule(){
	return require('ti.mapsforge');
}
function initVar(){
	var ALL = {
		Marker:{"dest":0},
		Gps:{"lat":0,"lng":0,"heading":0,"accuracy":0,"speed":0},
		Line:{"route":0},
		Nodes:{}
	};
	return ALL;
}
function hideBar(win){
	var actionBar = win.activity.actionBar;
	if(typeof actionBar !== 'undefined'){
		actionBar.hide();
	}
}
function initMap(win,module){
	var mapView = module.createMapsforgeView({
	 "scalebar": true,
	 "minZoom": 5, //Min zoom level for map view
	 "maxZoom": 20, //Max zoom level for map view
	 "centerLatlng": [-43.524551, 172.58346], //locke
	 "zoomLevel": 12, //Bogus initial zoom level
	 "debug": false });
	//mapView.centerLatlng = [-43.524551, 172.58346];
	//mapView.zoomLevel = 12;
	//Ti.API.info('mapView: ' + JSON.stringify(mapView));
	win.add(mapView);
	win.open();
	Ti.API.info('mapView: ' + JSON.stringify(mapView));
	return mapView;
}
function addOfflineMapLayer(map){
	map.addLayer({
		"name": "osm",
		"path": "osmdroid/maps/nz/nz.map",
	});
}
function initNav(mf){
	//load graphhopper folder
	mf.load("/osmdroid/maps/nz/");
}
function addListeners(){
	Ti.App.addEventListener('clicked', function(e) {
		var resid = Ti.App.Android.R.drawable.marker_tap;
		var point=[e.lat,e.lng];
	    //var poiPoint = findPOI(point,radius);
	    //addMarker(poiPoint);
	    //openPopup();
	});
	Ti.App.addEventListener('longclicked', function(e) {
		Ti.API.info('longclicked('+e.lat+','+e.lng+')');
		var from = [-43.524551, 172.58346];
		var to = [e.lat,e.lng];
		navi(from,to);
		removePrevDestMarker();
		addMarker(to);
	});
}

function removePrevDestMarker(){
	var pre_marker = ALL.Marker["dest"];
	if(pre_marker!==0){
		mapView.removeLayer(pre_marker);
	}
}
function addMarker(to){
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