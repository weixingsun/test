function changeDestination(e){Ti.API.info("changeDestination:"+e),setDestinatePos(e),removePrevDestMarker();var i=Ti.App.Android.R.drawable.marker_tap_long,t=Ti.App.Android.R.drawable.marker_tap,a=0;a=isGoogleMap()?addMarker("dest_marker",e,t,!1):addMarker("dest_marker",e,i,!1),Ti.App.Properties.setInt("dest_marker",a),hidePopView(),showPopView(e),Ti.API.info("changeDestination() to "+e)}function addNodeMarkers(){for(var e=getNodes(),i=JSON.parse(e),t=[],a=0;a<i.length;a++){var o=i[a].pts[0],n=[o[1],o[0]],r=Ti.App.Android.R.drawable.point_red,s="RouteMarker_"+JSON.stringify(n),l=addMarker(s,n,r,!1);t.push(isGoogleMap()?s:l)}saveNodeMarker(t)}function removePrevAll(){removePrevLine(),removePrevDestMarker(),removePrevNodeMarkers()}function removePrevRoute(){removePrevLine(),removePrevNodeMarkers()}function removePrevLine(){if(isGoogleMap())removeMyGooglePolyline("route");else{var e=Ti.App.Properties.getInt("route");0!==e&&map.removeLayer(e)}}function removePrevDestMarker(){isGoogleMap()?removeMyGoogleMarker("dest_marker"):0!==Ti.App.Properties.getInt("dest_marker")&&map.removeLayer(Ti.App.Properties.getInt("dest_marker"))}function removePrevNodeMarkers(){var e=Ti.App.Properties.getString("RouteMarkers");if(!(e.length<1)){var i=JSON.parse(e);if(isGoogleMap())for(var t=0;t<i.length;t++)removeMyGoogleMarker(i[t]);else for(var t=0;t<i.length;t++)map.removeLayer(i[t])}}