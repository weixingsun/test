//var mf = require('ti.mapsforge');
//Headings are north based azimuth (clockwise) in (0, 360) or NaN for equal preference.

function navi(module,map,from,to){
	var by = Ti.App.Properties.getString('by');
	var args = {
	 "weighting": "fastest",	//fast/short
	 "vehicle":   by,		//car/foot/bicycle/bus
	 "from": from,
	 "to":   to
	};
	module.getRouteAsyncCallback(args,function(data){
		if(data.error==0){
			removePrevRoute();
			var line = map.createPolyline({
				"latlngs": data.pts,
				"color": "blue",
				"strokeWidth": 10
				});
			Ti.App.Properties.setInt('route',line.id);
			Ti.App.Properties.setString('Nodes',JSON.stringify(data.nodes));
			addNodeMarkers();
			Ti.App.Properties.setInt("MODE",1);
			win.setKeepScreenOn(true);
		}else{
			Ti.API.info("navi error:"+data.error);
		}
	});
}
