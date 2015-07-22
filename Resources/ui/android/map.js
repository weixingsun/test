
initVars();
var win = initWindow();
initWindowEvent(win);
var mf = initModule();
var map = initMap(win,mf);
initMapListener(win,mf,map);
initNav(mf);
appEventListeners();
createAndroidSearchBar();

function initWindowEvent(win){
	win.addEventListener('focus', function() {
		//Ti.API.info('win1 got focus');
		hideBar(win);
		var pop = createPlaceView();
		Ti.App.Properties.setObject('pop',pop);
	});
}
function hideBar(win){
	var actionBar = win.activity.actionBar;
	//Ti.API.info('actionBar:'+actionBar );
	if(typeof actionBar !== 'undefined'){
		actionBar.hide();
	}
}
function initWindow(){
	return Ti.UI.createWindow();
}
function initModule(){
	return require('ti.mapsforge');
}

function initMap(win,module){
	var lon = Ti.App.Properties.getDouble("gps_lng",0);
	var lat = Ti.App.Properties.getDouble("gps_lat",0);
	var mapView = module.createMapsforgeView({
	 "scalebar": true,
	 "minZoom": 5, //Min zoom level for map view
	 "maxZoom": 20, //Max zoom level for map view
	 "centerLatlng": [lat, lon], //locke
	 "zoomLevel": 16, //Bogus initial zoom level
	 "debug": false });
	//mapView.centerLatlng = [-43.524551, 172.58346];
	//mapView.zoomLevel = 12;
	win.add(mapView);
	win.open();
	return mapView;
}
function addOfflineMapLayer(map){
	map.addLayer({
		"name": "osm",
		"path": "osmdroid/maps/nz/nz.map",
	});
}
function initNav(module){
	module.load("/osmdroid/maps/nz/");
}

function initMapListener(win,module,map){
	Ti.App.addEventListener('viewCreated', function(e) {
		Ti.API.info('mapCreated: received by js' );
		addOfflineMapLayer(map);
		addActionListeners(module,map);
		initGPS();
	});
}
function hidePopView(){
	var pop = AllViews["pop"];
	if(typeof pop !== 'undefined')
		pop.hide();
}
function showPopView(){
	var pop = AllViews["pop"];
	if(typeof pop !== 'undefined')
		pop.show();
}


function findDestMarker(point){
	
};
function addMarker(map,to,id){
	//platform/android/res/drawable/marker_tap.png
	//Ti.App.Android.R.drawable.marker_tap_long
	var mk = map.createMarker({
		"iconPath": id,
		"latlng": to
    });
    return mk.id;
}
function addNodeMarkers(){
	var strNodes = getNodes();
	var nodes = JSON.parse(strNodes);
	/*for (var node in nodes){}	//not working */
	var nodeMarkerIds = [];
	for (var i = 0; i < nodes.length; i++){
	    var p = nodes[i].pts[0];
	    var pp = [p[1],p[0]];
	    var id=Ti.App.Android.R.drawable.point_red;
	    var mkid=addMarker(map,pp,id);
		nodeMarkerIds.push(mkid);
	}
	Ti.App.Properties.setString('RouteMarkers',JSON.stringify(nodeMarkerIds));
}
function removePrevLine(){
	var pre_line = Ti.App.Properties.getInt('route');
	if(pre_line!==0){
		map.removeLayer(pre_line);
	}
}
function removePrevDestMarker(){
	if(Ti.App.Properties.getInt("dest") !==0){
		map.removeLayer(Ti.App.Properties.getInt("dest"));
	}
}
function removePrevNodeMarkers(){
	var nodeMarkers = Ti.App.Properties.getString("RouteMarkers");
	if(nodeMarkers.length<1) return;
	var nodes = JSON.parse(nodeMarkers);
	for (var i = 0; i < nodes.length; i++){
		map.removeLayer(nodes[i]);
	}
}


