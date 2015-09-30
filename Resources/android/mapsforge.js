//importUtteranceModule();
//initSpeachToText();
function Mapsforge() {
	this.mapmodule=require('ti.mapsforge');
	this.navimodule=this.mapmodule;
	this.myLocMarker=0;
	this.myLocCircle=0;
	this.type=1;
};
Mapsforge.prototype = new Map();
Mapsforge.prototype.initWindowEvent = function () {
	var that = this;
	this.win.addEventListener('focus', function() {
		//Ti.API.info('win1 got focus');
		views.createPlaceView();
		views.createSearchList();
		views.hideBar();
	});
	Ti.App.addEventListener('viewCreated', function(e) {
		Ti.API.info('mapCreated: received by js' );
		//appEventListeners();
		that.addOfflineMapLayer();
		views.createAndroidSearchBar();
		that.initGPS();
		that.showAllSavedPlaceMarkers();
		places.createSavedPlaceTable();
		///////////installOfflinePoiDB();
	});
	Ti.App.addEventListener('clicked', function(e) {
		var latlng=[e.lat,e.lng];
		//var xy=[e.x,e.y];
	    //var p = findPOI(point,radius);
	    var markerTap = places.findSavedMarker(latlng);//{mk:0,latlng:[0,0]};
	    if(markerTap!== null)
	    	that.changeDestination([markerTap.lat,markerTap.lng]);
	    //animateTo(point);
	    views.hideSearchList();
	    views.hideKeyboard();
	});
	Ti.App.addEventListener('longclicked', function(e) {
		var to = [e.lat,e.lng];
		Ti.API.info('longclicked:'+to);
   		that.changeDestination(to);
	});
};
Mapsforge.prototype.init = function(){
	var lon = Ti.App.Properties.getDouble("gps_lng",0);
	var lat = Ti.App.Properties.getDouble("gps_lat",0);
	this.mapView = this.mapmodule.createMapsforgeView({
		"scalebar": true,
		"minZoom": 5,  //Min zoom level for map view
		"maxZoom": 20, //Max zoom level for map view
		"centerLatlng": [lat, lon], //locke [-43.524551, 172.58346];
		"zoomLevel": 16, //Bogus initial zoom level
		"debug": false });
	this.win.add(this.mapView);
	this.win.open();
	this.initWindowEvent();
	this.initNav();
};
Mapsforge.prototype.move = function (to){
	this.mapView.centerLatlng = to;
};
Mapsforge.prototype.animateTo = function(to){
	this.mapView.animateTo(to);
};
Mapsforge.prototype.addOfflineMapLayer = function (){
	this.mapView.addLayer({
		"name": "osm",
		"path": Ti.App.id+"/map/nz.map",
	});
};
Mapsforge.prototype.addPolyline = function (pts,color,width){
	return this.mapView.createPolyline({
		"latlngs": pts,
		"color": color,
		"strokeWidth": width
	});
};
	//offset=0 center
	//offset=1 bottom
	// (0, 0) for anchor (center, center)
	// (0, -bitmap.getHeight() / 2) for anchor (center, bottom).
Mapsforge.prototype.addMarker =function (to,id){
	//platform/android/res/drawable/marker_tap.png
	//Ti.App.Android.R.drawable.marker_tap_long
	var mkid = this.mapView.createMarker({
		"iconPath": id,
		"latlng": to,
		//horizontalOffset,verticalOffset
    });
    //Ti.API.info("addMarker()"+JSON.stringify(mkid));
    //{"id":1135727744,"latlng":[-43.52477599,172.58337179],"radius":231,"type":"circle","colorHex":"#33000099"}
    return mkid;
};
Mapsforge.prototype.removeMarker = function(id){
	this.mapView.removeLayer(id);
};
Mapsforge.prototype.removePolyline = function(id){
	this.mapView.removeLayer(id);
};
Mapsforge.prototype.removeLayer = function(id){
	this.mapView.removeLayer(id);
};
Mapsforge.prototype.addCircle = function (point,range,color){
	var ccid = this.mapView.createCircle({
		"radius": range,
		"latlng": point,
		"colorHex": color, //"#33000099",
    });
    //Ti.API.info("addCircle()"+JSON.stringify(ccid));
    return ccid;
};
Mapsforge.prototype.updateCircle = function (id,me,range){
	this.mapView.updateLayer({
		"id": id,
		"type":"circle",
		"latlng":me,
		"radius":range,
		"move":1
	});
};
Mapsforge.prototype.updateMarker= function(id,me){
	this.mapView.updateLayer({
		"id":id,
		"type":"marker",
		"latlng":me,
		"move":1
	});
};
Mapsforge.prototype.changeDestination=function(point){
	views.hidePopView();
	this.destination=point;
	if(this.dest_marker!==0)
		this.mapView.removeLayer(this.dest_marker);
	var idmf=Ti.App.Android.R.drawable.marker_tap_long;
	var mkid=this.addMarker(point,idmf);
	this.dest_marker=mkid;
	views.showPopView(point);
	//animateTo(point);
	//Ti.API.info('changeDestination() to '+point);
};
Mapsforge.prototype.addMyLocMarker=function (me,accuracy){
	if(this.myLocCircle !== 0 || this.myLocMarker !== 0){
    	//map.removeLayer(cc);
    	//map.removeLayer(mk);
    	this.updateCircle(this.myLocCircle,me,accuracy);
    	this.updateMarker(this.myLocMarker,me);
    	//Ti.API.info("updating my loc");
    }else{
		this.myLocCircle = this.addCircle(me,accuracy,"#33000099");
		this.myLocMarker = this.addMarker(me,Ti.App.Android.R.drawable.me_point_blue_1);
	}
};
