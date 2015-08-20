initVars('mapsforge.offline');
var win = initWindow();
initWindowEvent(win);
var navimodule = initMapsfirgeModule();
var map = initMapsforge(win,navimodule);
initMapListener(win,navimodule,map);
initNav(navimodule);
appEventListeners();
createAndroidSearchBar();
createSavedPlaceTable();

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
function initMapsfirgeModule(){
	return require('ti.mapsforge');
}

function initMapsforge(win,module){
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
	//mapView.zoomLevel = 16;
	win.add(mapView);
	win.open();
	return mapView;
}
function move(to){
	map.centerLatlng = to;
}

function animateTo(to){
	map.animateTo(to);
}

function addOfflineMapLayer(map){
	map.addLayer({
		"name": "osm",
		"path": Ti.App.id+"/map/nz.map",
	});
}

function initMapListener(win,module,map){
	Ti.App.addEventListener('viewCreated', function(e) {
		Ti.API.info('mapCreated: received by js' );
		addOfflineMapLayer(map);
		addActionListenersMF(module,map);
		initGPS();
		showAllSavedPlaceMarkers();
	});
}
function addMarkerMF(to,id){
	//platform/android/res/drawable/marker_tap.png
	//Ti.App.Android.R.drawable.marker_tap_long
	var mk = map.createMarker({
		"iconPath": id,
		"latlng": to
    });
    return mk.id;
}
function removeLayer(id){
	map.removeLayer(id);
}
