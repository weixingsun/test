function changeDestination(e){setDestinatePos(e),removePrevDestMarker();var i=Ti.App.Android.R.drawable.marker_tap_long,t=Ti.App.Android.R.drawable.marker_tap,a=0;a=isGoogleMap()?addMarker("dest_marker",e,t,!1):addMarker("dest_marker",e,i,!1),Ti.App.Properties.setString("dest_marker",a),hidePopView(),showPopView(e),Ti.API.info("changeDestination() to "+e)}function addNodeMarkers(){for(var e=getNodes(),i=JSON.parse(e),t=[],a=0;a<i.length;a++){var o=i[a].pts[0],n=[o[1],o[0]],r=Ti.App.Android.R.drawable.point_red,l="RouteMarker_"+o[1]+"_"+o[0],s=addMarker(l,n,r,!1);t.push(isGoogleMap()?l:s)}saveNodeMarker(t)}function removePrevAll(){removePrevLine(),removePrevDestMarker(),removePrevNodeMarkers()}function removePrevRoute(){removePrevLine(),removePrevNodeMarkers()}function removePrevLine(){if(isGoogleMap())removeMyGooglePolyline("route");else{var e=Ti.App.Properties.getInt("route");0!==e&&map.removeLayer(e)}}function removePrevDestMarker(){isGoogleMap()?removeMyGoogleMarker("dest_marker"):Ti.App.Properties.getString("dest_marker").length>0&&map.removeLayer(Ti.App.Properties.getString("dest_marker"))}function removePrevNodeMarkers(){var e=Ti.App.Properties.getString("RouteMarkers");if(!(e.length<1)){var i=JSON.parse(e);if(isGoogleMap())for(var t=0;t<i.length;t++)removeMyGoogleMarker(i[t]);else for(var t=0;t<i.length;t++)map.removeLayer(i[t])}}