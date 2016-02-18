//initSpeachToText();
function GoogleMap() {
	this.mapmodule=require('ti.map');
	this.navimodule=require('ti.mapsforge');
	this.type=0;
};
GoogleMap.prototype = new Map();
GoogleMap.prototype.init=function(){
	var that=this;
	var lon = Ti.App.Properties.getDouble("gps_lng",0);
	var lat = Ti.App.Properties.getDouble("gps_lat",0);
	this.mapView= this.mapmodule.createView({
	    userLocation: true,
	    mapType: this.mapmodule.NORMAL_TYPE,
	    //animate: true,
	    region: {latitude: lat, longitude: lon, latitudeDelta: 0.1, longitudeDelta: 0.1 },
	    height: '100%',
	    width: '100%',
	    top: 0,
	    left: 0,
	});
	this.addGmapActionListeners();
	this.win.add(this.mapView);
	this.win.open();
	this.win.addEventListener('focus', function() {
		views.createPlaceView();
		views.createSearchList();
		views.hideBar();
	});
	this.initNav();
};
//new googlemap module 2.3.2
GoogleMap.prototype.addGmapActionListeners=function (){
	var that = this;
	this.mapView.addEventListener('click', function(e) {
		var latlng=[e.latitude,e.longitude];
		var markerId=e.markerId;
		if(markerId!=null){
			that.changeDestination(latlng);
		}
	    //var markerTap = findSavedMarker(latlng);
	    //if(markerTap!== null) changeDestination(markerTap.latlng);
	    //animateTo(point);
	    views.hideKeyboard();
	    views.hideSearchList();
	});
	this.mapView.addEventListener('longclick', function(e) {
		//removeMyGoogleMarker('dest');
		//removeMyGooglePolyline('navi');
		var dest = [e.latitude,e.longitude];
		//var me = getCurrentPos();
		that.changeDestination(dest);
		//naviGoogle(module,me,dest);
		//addMyGoogleMarker('dest',dest[0],dest[1],Ti.App.Android.R.drawable.marker_tap,false);
		//navi(navimodule,me,dest);
	});
	//load complete
	this.mapView.addEventListener('complete', function(e){
		Ti.API.info('map load complete');
		//appEventListeners();
		views.createAndroidSearchBar();
		that.initGPS();
		places.showAllSavedPlaceMarkers();
		places.createSavedPlaceTable();
		//installOfflinePoiDB();
		//complete:e={"type":"complete","source":{"bubbleParent":true,"enabled":true,"region":{"latitude":-43.53449409,"longitude":172.60395921,"latitudeDelta":0.1,"longitudeDelta":0.1},"maxZoomLevel":21,"minZoomLevel":3,"backgroundRepeat":false,"height":"100%","left":0,"compassEnabled":true,"children":[],"rect":{"height":887,"y":0,"x":0,"width":600},"visible":true,"width":"100%","size":{"height":887,"y":0,"width":600,"x":0},"keepScreenOn":false,"userLocation":true,"animate":true,"apiName":"Ti.Map","top":0,"mapType":1,"_events":{"click":{},"longpress":{},"complete":{}}},"bubbles":true,"cancelBubble":false}
    });
    //regionchanged
    var updateMapTimeout;
	this.mapView.addEventListener('regionchanged', function(ee) {
	    if (updateMapTimeout) clearTimeout(updateMapTimeout);
	    var center = [ee.latitude,ee.longitude];
		var msg = "["+ee.latitude+","+ee.longitude+"]" +"delta["+ee.latitudeDelta+","+ee.longitudeDelta+"]";
	    /*
	    region={
			latitude: ee.latitude,
			longitude: ee.longitude,
			animate:true,
			latitudeDelta:ee.latitudeDelta,
			longitudeDelta:ee.longitudeDelta
		};*/
		updateMapTimeout = setTimeout(function() {
	        //update your map
	        Ti.API.info('regionchanged: '+msg);
	        //lat-latitudeDelta/2 ~ lat+latitudeDelta/2
	        //lon-longitudeDelta/2 ~ lon+longitudeDelta/2
	        places.searchOfflineCctv(center);
	    }, 50);//50-200
	});
};
GoogleMap.prototype.changeDestination=function(point){
	views.hidePopView();
	this.destination=point;
	if(this.dest_marker!==0)
		this.mapView.removeMarker(this.dest_marker);
	var idgg=Ti.App.Android.R.drawable.marker_tap_long;
	this.addMarkerName('dest_marker',point,idgg);//anchor
	this.dest_marker='dest_marker';
	views.showPopView(point);
	//animateTo(point);
	//Ti.API.info('changeDestination() to '+point);
};
GoogleMap.prototype.addMarker=function (latlng,img){//,draggable=false
	var name=latlng[0]+','+latlng[1];
	this.addMarkerName(name,latlng,img);
	return name;
};
GoogleMap.prototype.addMarkerName=function (name,latlng,img){//,draggable=false
	var anchor = [];
	var params = {
        latitude:latlng[0],
        longitude:latlng[1],
        id:name,
        //animate:true,
        image: img, //resourceId, 
        draggable: false,
        //size: new google.maps.Size(20, 32),
        //origin: new google.maps.Point(0, 0),
		//anchor: new google.maps.Point(0, 32),
    };
	this.mapView.addMarker(params);
	return name;
};
GoogleMap.prototype.removeMarker=function (id){
	this.mapView.removeMarker(id);
};
GoogleMap.prototype.removePolyline=function (id){
	this.mapView.removePolyline(id);
};
GoogleMap.prototype.addPolyline = function (pts,color,width){
	var options = {
		id: "route",
	    points: pts,
	    color: color,
	    width : width,
	};
	this.mapView.addPolyline(options);
	return "route";
	
};
GoogleMap.prototype.animateTo=function(to){
	//zoom,bearing
	var currentRegion = this.mapView.getRegion();
	currentRegion.latitude = to[0];
	currentRegion.longitude = to[1];
	//	animate:true,
	//Ti.API.info('delta='+currentRegion.latitudeDelta+','+currentRegion.longitudeDelta);
	this.mapView.setLocation(currentRegion); //getFitZoomMapRegionWithCoords(to));
};
GoogleMap.prototype.setTraffic=function (traffic){
	this.mapView.setTrafficEnabled(traffic);
};
//module.NORMAL_TYPE/TERRAIN_TYPE/HYBRID_TYPE/SATELLITE_TYPE
GoogleMap.prototype.setGoogleMapType=function (type){
	this.mapView.setMapType(type);
};

/*
 * 
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
#todo list
ti.map.TiUIMapView.onMarkerClick()

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