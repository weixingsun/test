function addMarker(e,i,t){var r=e.createMarker({iconPath:t,latlng:i});return r.id}function addNodeMarkers(){for(var e=getNodes(),i=JSON.parse(e),t=[],r=0;r<i.length;r++){var a=i[r].pts[0],n=[a[1],a[0]],o=Ti.App.Android.R.drawable.point_red,s=addMarker(map,n,o);t.push(s)}Ti.App.Properties.setString("RouteMarkers",JSON.stringify(t))}function removePrevAll(){removePrevLine(),removePrevDestMarker(),removePrevNodeMarkers()}function removePrevLine(){var e=Ti.App.Properties.getInt("route");0!==e&&map.removeLayer(e)}function removePrevDestMarker(){0!==Ti.App.Properties.getInt("dest")&&map.removeLayer(Ti.App.Properties.getInt("dest"))}function removePrevNodeMarkers(){var e=Ti.App.Properties.getString("RouteMarkers");if(!(e.length<1))for(var i=JSON.parse(e),t=0;t<i.length;t++)map.removeLayer(i[t])}