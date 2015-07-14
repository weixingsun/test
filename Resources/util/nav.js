//var mf = require('ti.mapsforge');
//Headings are north based azimuth (clockwise) in (0, 360) or NaN for equal preference.
//double startHeading, double endHeading
//var points = [[1,2],[3,4],[5,6]];
//  var x = new Array(10);
//  for (var i = 0; i < 10; i++) {
//    x[i] = new Array(20);
//  }

function navi(from,to){
	var args = {
	 "weighting": "fastest",	//fast/short
	 "vehicle":   "car",		//walk/bicycle/bus
	 "from": from, //locke
	 "to":   to, //home
	 "debug": false
	};
	mf.getRouteAsyncCallback(args,function(data){
		if(data.error==0){
			var pre_line = ALL.PolyLine["route"];
			if(pre_line!==0){
				mapView.removeLayer(pre_line);
			}
			var line = mapView.createPolyline({
				"latlngs": data.pts,
				"color": "blue",
				"strokeWidth": 10
				});
			ALL.PolyLine["route"]=line.id;
			Ti.API.info("test: nodes.size()="+data.nodes.length+",node0.sign="+data.nodes[0].sign+",node0.name="+data.nodes[0].name+",node0.pts="+data.nodes[0].pts);
			ALL.Nodes=data.nodes;
		}
	});
}