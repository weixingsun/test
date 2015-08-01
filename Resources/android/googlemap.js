initVars();
var win = initWindow();
initWindowEvent(win);
var module = initGoogleModule();
var graph = initGraphhopperModule();
var map = initGoogleMap(win,module);
initNav(graph);
//initMapListener(win,module,map);
//initGPS();
//showAllSavedPlaceMarkers();
//appEventListeners();
//createAndroidSearchBar();
//createSavedPlaceTable();
function initWindow(){
	return Ti.UI.createWindow();
}
function initWindowEvent(win){
	win.addEventListener('focus', function() {
		//Ti.API.info('win1 got focus');
		hideBar(win);
		var pop = createPlaceView();
	});
}
function hideBar(win){
	var actionBar = win.activity.actionBar;
	//Ti.API.info('actionBar:'+actionBar );
	if(typeof actionBar !== 'undefined'){
		actionBar.hide();
	}
}
function initGoogleModule(){
	return require('ti.map');
}
function initGraphhopperModule(){
	return require('ti.mapsforge');
}
function initGoogleMap(win,module){
	var lon = Ti.App.Properties.getDouble("gps_lng",0);
	var lat = Ti.App.Properties.getDouble("gps_lat",0);

	var map1 = module.createView({
	    userLocation: true,
	    mapType: module.NORMAL_TYPE,
	    animate: true,
	    region: {latitude: lat, longitude: lon, latitudeDelta: 0.1, longitudeDelta: 0.1 },
	    height: '100%',
	    width: '100%',
	    top: 0,
	    left: 0,
	});
	/*map1.addAnnotation(Ti.Map.createAnnotation({
	    animate : true,
	    pincolor : Ti.Map.ANNOTATION_RED,
	    title : 'annotation',
	    latitude : lat,
	    longitude : lon,
	}));*/
	addGmapActionListeners(map1);
	win.add(map1);
	win.open();
	return map1;
}
//new googlemap module 2.3.2
function addGmapActionListeners(map){
	map.addEventListener('click', function(e) {
	    var lng = e.longitude;
	    var lat = e.latitude;
		Ti.API.info('map.clicked:'+lat+','+lng);
	});
	map.addEventListener('longclick', function(e) {
	    var lng = e.longitude;
	    var lat = e.latitude;
		Ti.API.info('map.longclick:'+lat+','+lng);//no properties like e.x e.y
	});
	//regionchanged
	map.addEventListener('complete', function(e){
		Ti.API.info('map load complete');
		//complete:e={"type":"complete","source":{"bubbleParent":true,"enabled":true,"region":{"latitude":-43.53449409,"longitude":172.60395921,"latitudeDelta":0.1,"longitudeDelta":0.1},"maxZoomLevel":21,"minZoomLevel":3,"backgroundRepeat":false,"height":"100%","left":0,"compassEnabled":true,"children":[],"rect":{"height":887,"y":0,"x":0,"width":600},"visible":true,"width":"100%","size":{"height":887,"y":0,"width":600,"x":0},"keepScreenOn":false,"userLocation":true,"animate":true,"apiName":"Ti.Map","top":0,"mapType":1,"_events":{"click":{},"longpress":{},"complete":{}}},"bubbles":true,"cancelBubble":false}
    });
}
function addGoogleMarker(){
	
}
function addGooglePolyline(){
	
}

/*
win.add(map2);
win.add(map3);
win.add(map4);
 var map2 = module.createView({
    userLocation: true,
    mapType: module.TERRAIN_TYPE,
    animate: true,
    region: {latitude: -33.87365, longitude: 151.20689, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    height: '50%',
    top: 0,
    right: 0,
    width: '50%'
});
var map3 = module.createView({
    userLocation: true,
    mapType: module.SATELLITE_TYPE,
    animate: true,
    region: {latitude: -33.87365, longitude: 151.20689, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    height: '50%',
    bottom: 0,
	left: 0,
    width: '50%'
});
var map4 = module.createView({
    userLocation: true,
    mapType: module.HYBRID_TYPE,
    animate: true,
    region: {latitude: -33.87365, longitude: 151.20689, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    height: '50%',
    bottom: 0,
    right: 0,
    width: '50%',
    traffic: true
});
 */