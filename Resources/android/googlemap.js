initVars();
var win = initWindow();
initWindowEvent(win);
var module = initGoogleModule();
var map = initGoogleMap(win,module);
//initMapListener(win,module,map);
initNav(module);
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
	win.add(map1);
	win.open();
	return map1;
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