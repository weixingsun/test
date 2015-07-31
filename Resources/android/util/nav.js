//var mf = require('ti.mapsforge');
//Headings are north based azimuth (clockwise) in (0, 360) or NaN for equal preference.

function navi(module,map,from,to){
	var by = Ti.App.Properties.getString('by');
	var args = {
	 "vehicle":   by,		//car/foot/bicycle/bus
	 "from": from,
	 "to":   to
	};
	// "weighting": "fastest",	//fast/short
	module.getRouteAsyncCallback(args,function(data){
		if(data.error==0){
			removePrevRoute();
			var line = map.createPolyline({
				"latlngs": data.pts,
				"color": "blue",
				"strokeWidth": 10
				});
			savePolylineId(line.id);
			saveRouteInfo(data.nodes);
			addNodeMarkers();
			setNaviMode(1);
			win.setKeepScreenOn(true);
			setEmptyPlayedList(data.nodes);
		}else{
			Ti.API.info("navi error:"+data.errmsg);
		}
	});
}
