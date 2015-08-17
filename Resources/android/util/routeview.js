function changeDestination(point){
	Ti.API.info('changeDestination:'+point);
	setDestinatePos(point);
	removePrevDestMarker();
	var idmf=Ti.App.Android.R.drawable.marker_tap_long;
	var idgg=Ti.App.Android.R.drawable.marker_tap;
	var mkid=0;
	if(isGoogleMap()){
		mkid = addMarker('dest_marker',point,idgg,false);
	}else{
		mkid = addMarker('dest_marker',point,idmf,false);
	}
	Ti.App.Properties.setInt("dest_marker",mkid);
	hidePopView();
	showPopView(point);
	Ti.API.info('changeDestination() to '+point);
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
	    var name = 'RouteMarker_'+JSON.stringify(pp);
	    var mkid=addMarker(name,pp,id,false);
	    if(isGoogleMap()) nodeMarkerIds.push(name);
		else nodeMarkerIds.push(mkid);
	}
	saveNodeMarker(nodeMarkerIds);
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
	if(isGoogleMap()){
		removeMyGooglePolyline('route');
	}else{
		var pre_line = Ti.App.Properties.getInt('route');
		if(pre_line!==0) map.removeLayer(pre_line);
	}
}
function removePrevDestMarker(){
	if(isGoogleMap()){
		removeMyGoogleMarker('dest_marker');
	}else{
		if(Ti.App.Properties.getInt("dest_marker") !==0)
			map.removeLayer(Ti.App.Properties.getInt("dest_marker"));
	}
}
function removePrevNodeMarkers(){
		var nodeMarkers = Ti.App.Properties.getString("RouteMarkers");
		if(nodeMarkers.length<1) return;
		var nodes = JSON.parse(nodeMarkers);
		if(isGoogleMap()){
			for (var i = 0; i < nodes.length; i++){
				removeMyGoogleMarker(nodes[i]);
			}
		}else{
			for (var i = 0; i < nodes.length; i++){
				map.removeLayer(nodes[i]);
			}
		}
}