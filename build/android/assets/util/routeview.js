function addMarker(e,i,t){var a=e.createMarker({iconPath:t,latlng:i});return a.id}function addNodeMarkers(){for(var e=getNodes(),i=JSON.parse(e),t=[],a=0;a<i.length;a++){var r=i[a].pts[0],n=[r[1],r[0]],o=Ti.App.Android.R.drawable.point_red,s=addMarker(map,n,o);t.push(s)}Ti.App.Properties.setString("RouteMarkers",JSON.stringify(t))}function removePrevAll(){removePrevLine(),removePrevDestMarker(),removePrevNodeMarkers()}function removePrevRoute(){removePrevLine(),removePrevNodeMarkers()}function removePrevLine(){var e=Ti.App.Properties.getInt("route");0!==e&&map.removeLayer(e)}function removePrevDestMarker(){0!==Ti.App.Properties.getInt("dest_marker")&&map.removeLayer(Ti.App.Properties.getInt("dest_marker"))}function removePrevNodeMarkers(){var e=Ti.App.Properties.getString("RouteMarkers");if(!(e.length<1))for(var i=JSON.parse(e),t=0;t<i.length;t++)map.removeLayer(i[t])}