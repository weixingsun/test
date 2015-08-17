function initNav(module){
	module.load(Ti.App.id+"/gh/nz/");
}
//Headings are north based azimuth (clockwise) in (0, 360) or NaN for equal preference.

function navi(navimodule,from,to){
	var by = Ti.App.Properties.getString('by');
	var args = {
	 "vehicle":   by,		//car/foot/bicycle/bus
	 "from": from,
	 "to":   to
	};
	//weighting:fastest,	//fast/short
	navimodule.getRouteAsyncCallback(args,function(data){
		if(data.error==0){
			if(isGoogleMap())
				drawGHonGMap(data);
			else
				drawGHonMapsforge(data);
		}else{
			Ti.API.info("navi error:"+data.errmsg);
		}
	});
}
function drawGHonGMap(data){
	//data.pts = [[lng,lat],[lng,lat]];
	var options = {
		id: "navi",
	    points: data.pts,
	    color: 'blue',
	    width : 10,
	};
	addMyGooglePolyline(options);
}
function drawGHonMapsforge(data){
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
}
function naviGoogle(module,start,end){
	var points = [];
	var loader = Ti.Network.createHTTPClient();
	var pre = "http://maps.googleapis.com/maps/api/directions/json?sensor=false&";
    var addrUrl = pre+"origin="+start[0]+","+start[1]+"&destination="+end[0]+","+end[1];
    Ti.API.info(addrUrl);
    loader.open("GET",addrUrl);
    loader.onload = function(){
        var response = JSON.parse(this.responseText);
        if (response.routes.length > 0){
            var points = createRouteDataGoogle(response);
			var route = module.createRoute({
				name: "navi",
			    points: points,
			    color: 'red',
			    width : 10,
			});
		    Ti.API.info("googleRoute.onload:"+points.length);
			addGoogleRoute(route);
        } else{
            return;
        }
    };
	loader.send();
}
var createRouteDataGoogle = function(json){
    var step = json.routes[0].overview_polyline.points;// brief points
    //var intStep = step.length;
    var points = [];
    var decodedPolyline, intPoint = 0, intPoints = 0;

    decodedPolyline = decodeLineGoogle(step);
    intPoints = decodedPolyline.length;
    for (intPoint = 0; intPoint < intPoints; intPoint = intPoint + 1){
        if (decodedPolyline[intPoint] != null){
            points.push({
                latitude: decodedPolyline[intPoint][0],
                longitude: decodedPolyline[intPoint][1]
            });
        }
    }

    return points;
};
var decodeLineGoogle = function(encoded){
    var len = encoded.length;
    var index = 0;
    var array = [];
    var lat = 0;
    var lng = 0;

    while (index < len){
        var b;
        var shift = 0;
        var result = 0;
        do{
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        }
        while (b >= 0x20);

        var dlat = ((result & 1) ? ~ (result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;
        do{
            b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        }
        while (b >= 0x20);

        var dlng = ((result & 1) ? ~ (result >> 1) : (result >> 1));
        lng += dlng;

        array.push([lat * 1e-5, lng * 1e-5]);
    }

    return array;
};
