var ALL = initVar();
var win = initWindow();
initWindowEvent(win);
var mf = initModule();
var map = initMap(win,mf);
initMapListener(win,mf,map);
initNav(mf);


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

function initVar(){
	var ALL = {
		Marker:{"me":0,"dest":0},
		Gps:{"lat":0,"lng":0,"heading":0,"accuracy":0,"speed":0},
		Line:{"route":0},
		Nodes:{}
	};
	return ALL;
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
		Ti.API.info('clicked' +point);
	    //var poiPoint = findPOI(point,radius);
	    //addMarker(poiPoint);
	    //openPopup();
	});
	Ti.App.addEventListener('longclicked', function(e) {
		Ti.API.info('longclicked('+e.lat+','+e.lng+')');
		if(ALL.Gps["lat"]==0 || ALL.Gps["lng"]==0){
			Ti.API.info('GPS not available');
		}else{
			var from = [ALL.Gps["lat"], ALL.Gps["lng"]];
			var to = [e.lat,e.lng];
			navi(module,map,from,to);
			removePrevDestMarker(map);
			addMarker(map,to);
			addNodeMarkers();
		}
	});
}

function removePrevDestMarker(map){
	if(ALL.Marker["dest"] !==0){
		map.removeLayer(ALL.Marker["dest"]);
	}
}
function addMarker(map,to){
	//platform/android/res/drawable/marker_tap.png
	var dest = map.createMarker({
		"iconPath": Ti.App.Android.R.drawable.marker_tap_long,
		"latlng": to
    });
    ALL.Marker["dest"]=dest.id;
}
function addNodeMarkers(){
	var size = ALL.Nodes.length;
	for (node in ALL.Nodes){
		node.pts;
		node.sign;
	}
}

function navi(module,map,from,to){
	var args = {
	 "weighting": "fastest",	//fast/short
	 "vehicle":   "car",		//walk/bicycle/bus
	 "from": from, //locke
	 "to":   to, //home
	 "debug": false
	};
	module.getRouteAsyncCallback(args,function(data){
		if(data.error==0){
			var pre_line = ALL.Line["route"];
			if(pre_line!==0){
				map.removeLayer(pre_line);
			}
			var line = map.createPolyline({
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