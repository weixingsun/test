var map_type = 'google.normal';
initVars(map_type);
var win = initWindow();
initWindowEvent(win);
var module = initGoogleModule();
var graph = initGraphhopperModule();
var map = initGoogleMap(win,module);
initNav(graph);
initGPS();
//showAllSavedPlaceMarkers();
//appEventListeners();
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
	    //animate: true,
	    region: {latitude: lat, longitude: lon, latitudeDelta: 0.1, longitudeDelta: 0.1 },
	    height: '100%',
	    width: '100%',
	    top: 0,
	    left: 0,
	});
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
		//addGoogleMarker(lat,lng,'drawable/marker_tap.png');
	});
	map.addEventListener('longclick', function(e) {
		removeMyGoogleMarker('dest');
		removeMyGooglePolyline('navi');
		var dest = [e.latitude,e.longitude];
		var me = getCurrentPos();
		//naviGoogle(module,me,dest);
		addMyGoogleMarker('dest',dest[0],dest[1],Ti.App.Android.R.drawable.marker_tap,false);
		navi(graph,map,me,dest);
	});
	//regionchanged
	map.addEventListener('complete', function(e){
		Ti.API.info('map load complete');
		createAndroidSearchBar();
		//complete:e={"type":"complete","source":{"bubbleParent":true,"enabled":true,"region":{"latitude":-43.53449409,"longitude":172.60395921,"latitudeDelta":0.1,"longitudeDelta":0.1},"maxZoomLevel":21,"minZoomLevel":3,"backgroundRepeat":false,"height":"100%","left":0,"compassEnabled":true,"children":[],"rect":{"height":887,"y":0,"x":0,"width":600},"visible":true,"width":"100%","size":{"height":887,"y":0,"width":600,"x":0},"keepScreenOn":false,"userLocation":true,"animate":true,"apiName":"Ti.Map","top":0,"mapType":1,"_events":{"click":{},"longpress":{},"complete":{}}},"bubbles":true,"cancelBubble":false}
		//addActionListeners(module,map);
		//showAllSavedPlaceMarkers();
    });
}
function addMyGoogleMarker(name,lat,lng,img,draggable){
	var params = {
        latitude:lat,
        longitude:lng,
        id:name,
        //animate:true,
        image: img, //resourceId,
        draggable: draggable,
    };
	var mk = map.addMarker(params);
}
function removeMyGoogleMarker(id){
	map.removeMarker(id);
}
function addMyGooglePolyline(options){
	map.addPolyline(options);
}
function removeMyGooglePolyline(id){
	map.removePolyline(id);
}
function move(to){
	map.setLocation({
		latitude:to[0],
		longitude:to[1],
	});
}

function animateTo(to){
	//map.setLocation({
	//	latitude:to[0],
	//	longitude:to[1],
	//	animate:true,
    //  latitudeDelta : 0.01,
    //  longitudeDelta : 0.01,
	//});
	//zoom,bearing
	var currentRegion = map.getRegion();
	currentRegion.latitude = to[0];
	currentRegion.longitude = to[1];
	map.setLocation(currentRegion); //getFitZoomMapRegionWithCoords(to));
}

function setTraffic(traffic){
	map.setTrafficEnabled(traffic);
}
//module.NORMAL_TYPE/TERRAIN_TYPE/HYBRID_TYPE/SATELLITE_TYPE
function setGoogleMapType(type){
	map.setMapType(type);
}
function getFitZoomMapRegionWithCoords(points) {
 
    var topLeftLatitude = -90;
    var topLeftLongitude = 180;
    var bottomRightLatitude = 90;
    var bottomRightLongitude = -180;
 
    for (var i = 0; i < points.length; i++) {
        var reg = points[i];
        topLeftLongitude = Math.min(topLeftLongitude, parseFloat(reg.longitude));
        topLeftLatitude = Math.max(topLeftLatitude, parseFloat(reg.latitude));
        bottomRightLongitude = Math.max(bottomRightLongitude, parseFloat(reg.longitude));
        bottomRightLatitude = Math.min(bottomRightLatitude, parseFloat(reg.latitude));
    }
 
    var fitLatitude = topLeftLatitude - (topLeftLatitude - bottomRightLatitude) * 0.5;
    var fitLongitude = topLeftLongitude + (bottomRightLongitude - topLeftLongitude) * 0.5;
    var fitSpanLatDelta = Math.abs(topLeftLatitude - bottomRightLatitude) * 1.1;
    var fitSpanLongDelta = Math.abs(bottomRightLongitude - topLeftLongitude) * 1.1;
    if (fitSpanLatDelta == 0 && fitSpanLongDelta == 0) {
        fitSpanLatDelta = fitSpanLongDelta = 0.01;
    }
    var fitRegion = {
        latitude : fitLatitude,
        longitude : fitLongitude,
        latitudeDelta : fitSpanLatDelta,
        longitudeDelta : fitSpanLongDelta
    };
 
    return fitRegion;
};
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