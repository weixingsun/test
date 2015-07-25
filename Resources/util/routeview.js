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
function removePrevAll(){
	removePrevLine();
	removePrevDestMarker();
	removePrevNodeMarkers();
}
function removePrevRoute(){
	removePrevLine();
	removePrevNodeMarkers();
}
function removePrevLine(){
	var pre_line = Ti.App.Properties.getInt('route');
	if(pre_line!==0){
		map.removeLayer(pre_line);
	}
}
function removePrevDestMarker(){
	if(Ti.App.Properties.getInt("dest_marker") !==0){
		map.removeLayer(Ti.App.Properties.getInt("dest_marker"));
	}
}
function removePrevNodeMarkers(){
	var nodeMarkers = Ti.App.Properties.getString("RouteMarkers");
	if(nodeMarkers.length<1) return;
	var nodes = JSON.parse(nodeMarkers);
	for (var i = 0; i < nodes.length; i++){
		map.removeLayer(nodes[i]);
	}
}