initVars('mapsforge.offline');
importUtteranceModule();
//initSpeachToText();
var win = initWindow();
initWindowEvent(win);
var navimodule = initMapsfirgeModule();
var map = initMapsforge(win,navimodule);
initMapListener(win,navimodule,map);
initNav(navimodule);

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
		createAndroidSearchBar();
		addActionListenersMF(module,map);
		appEventListeners();
		initGPS();
		showAllSavedPlaceMarkers();
		createSavedPlaceTable();
		//installOfflinePoiDB();

	});
}
function addPolylineMF(pts,color,width){
	return map.createPolyline({
		"latlngs": pts,
		"color": color,
		"strokeWidth": width
		});
}
function addMarkerMF(to,id){
	//platform/android/res/drawable/marker_tap.png
	//Ti.App.Android.R.drawable.marker_tap_long
	var mkid = map.createMarker({
		"iconPath": id,
		"latlng": to
    });
    Ti.API.info("addMarkerMF()"+JSON.stringify(mkid));
    //{"id":1135727744,"latlng":[-43.52477599,172.58337179],"radius":231,"type":"circle","colorHex":"#33000099"}
    return mkid;
}

function addCircleMF(point,range,color){
	var ccid = map.createCircle({
		"radius": range,
		"latlng": point,
		"colorHex": color, //"#33000099",
    });
    //Ti.API.info("addCircleMF()"+JSON.stringify(ccid));
    return ccid;
}
function removeLayer(id){
	map.removeLayer(id);
}
function updateCircle(id,me,range){
	map.updateLayer({
		"id": id,
		"type":"circle",
		"latlng":me,
		"radius":range,
		"move":1
	});
}
function updateMarker(id,me){
	map.updateLayer({
		"id":id,
		"type":"marker",
		"latlng":me,
		"move":1
	});
}
