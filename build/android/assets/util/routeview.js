function addNodeMarkers(){for(var e=getNodes(),i=JSON.parse(e),t=[],a=0;a<i.length;a++){var n=i[a].pts[0],o=[n[1],n[0]],r=Ti.App.Android.R.drawable.point_red,s=addMarker(map,o,r);t.push(s)}saveNodeMarker(t)}function removePrevAll(){removePrevLine(),removePrevDestMarker(),removePrevNodeMarkers()}function removePrevRoute(){removePrevLine(),removePrevNodeMarkers()}function removePrevRouteGoogle(){}function removePrevLine(){var e=Ti.App.Properties.getInt("route");0!==e&&map.removeLayer(e)}function removePrevDestMarker(){0!==Ti.App.Properties.getInt("dest_marker")&&map.removeLayer(Ti.App.Properties.getInt("dest_marker"))}function removePrevNodeMarkers(){var e=Ti.App.Properties.getString("RouteMarkers");if(!(e.length<1))for(var i=JSON.parse(e),t=0;t<i.length;t++)map.removeLayer(i[t])}