initVars();
var win = initWindow();
initWindowEvent(win);
var mf = initModule();
var map = initMap(win,mf);
initMapListener(win,mf,map);
initNav(mf);

function initVars(){
	Ti.App.Properties.setInt("MODE",0);//0-none/1-navi/
	setNodes('');
	Ti.App.Properties.setInt("myCircle",0);
	Ti.App.Properties.setInt("mySpot",0);
	Ti.App.Properties.setInt("dest",0);
	Ti.App.Properties.setInt('route',0);
	Ti.App.Properties.setString('RouteMarkers','');
	var GH_TURN_DICT={
		"-3":"turn_sharp_left",
		"-2":"turn_left",
		"-1":"turn_slight_left",
		"0":"continue",
		"1":"turn_slight_right",
		"2":"turn_right",
		"3":"turn_sharp_right",
		"4":"finish",
		"5":"reached_via",
		"6":"use_roundabout"
	};
	Ti.App.Properties.setString('GH_TURN_DICT',JSON.stringify(GH_TURN_DICT));
}
function getNodes(){
	return Ti.App.Properties.getString('Nodes');
}
function setNodes(value){
	Ti.App.Properties.setString('Nodes',value);
}
function initWindowEvent(win){
	win.addEventListener('focus', function() {
		//Ti.API.info('win1 got focus');
		hideBar(win);
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
	var lon = Ti.App.Properties.getDouble("lng");
	var lat = Ti.App.Properties.getDouble("lat");
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
function addActionListeners(module,map){
	Ti.App.addEventListener('clicked', function(e) {
		var resid = Ti.App.Android.R.drawable.marker_tap;
		var point=[e.lat,e.lng];
		Ti.API.info('clicked:' +point);
	    //var p = findPOI(point,radius);
	    //addMarker(map,p,id);
	    //openPopup();
	});
	Ti.App.addEventListener('longclicked', function(e) {
		var from = [Ti.App.Properties.getDouble("lat"),Ti.App.Properties.getDouble("lng")];
		var to = [e.lat,e.lng];
		Ti.API.info('longclicked:'+to);
		if(from[0]==0 || from[1]==0){
			Ti.API.info('GPS not available');
		}else{
			navi(module,map,from,to);
			removePrevDestMarker(map);
			var id=Ti.App.Android.R.drawable.marker_tap_long;
			var mkid = addMarker(map,to,id);
			Ti.App.Properties.setInt("dest",mkid);
		}
	});
}

function removePrevDestMarker(map){
	if(Ti.App.Properties.getInt("dest") !==0){
		map.removeLayer(Ti.App.Properties.getInt("dest"));
	}
	var nodeMarkers = Ti.App.Properties.getString("RouteMarkers");
	if(nodeMarkers.length<1) return;
	var nodes = JSON.parse(nodeMarkers);
	for (var i = 0; i < nodes.length; i++){
		map.removeLayer(nodes[i]);
	}
}
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

function navi(module,map,from,to){
	var args = {
	 "weighting": "fastest",	//fast/short
	 "vehicle":   "foot",		//car/foot/bicycle/bus
	 "from": from,
	 "to":   to
	};
	module.getRouteAsyncCallback(args,function(data){
		if(data.error==0){
			var pre_line = Ti.App.Properties.getInt('route');
			if(pre_line!==0){
				map.removeLayer(pre_line);
			}
			var line = map.createPolyline({
				"latlngs": data.pts,
				"color": "blue",
				"strokeWidth": 10
				});
			Ti.App.Properties.setInt('route',line.id);
			Ti.App.Properties.setString('Nodes',JSON.stringify(data.nodes));
			addNodeMarkers();
			Ti.API.info("getRouteAsyncCallback().addNodeMarkers() done");
			Ti.App.Properties.setInt("MODE",1);
			win.setKeepScreenOn(true);
		}else{
			Ti.API.info("navi error:"+data.error);
		}
	});
}