function addMarker(e,t,i){var r=e.createMarker({iconPath:i,latlng:t});return r.id}function addNodeMarkers(){for(var e=getNodes(),t=JSON.parse(e),i=[],r=0;r<t.length;r++){var n=t[r].pts[0],o=[n[1],n[0]],a=Ti.App.Android.R.drawable.point_red,s=addMarker(map,o,a);i.push(s)}Ti.App.Properties.setString("RouteMarkers",JSON.stringify(i))}function removePrevAll(){removePrevLine(),removePrevDestMarker(),removePrevNodeMarkers()}function removePrevLine(){var e=Ti.App.Properties.getInt("route");0!==e&&map.removeLayer(e)}function removePrevDestMarker(){0!==Ti.App.Properties.getInt("dest")&&map.removeLayer(Ti.App.Properties.getInt("dest"))}function removePrevNodeMarkers(){var e=Ti.App.Properties.getString("RouteMarkers");if(!(e.length<1))for(var t=JSON.parse(e),i=0;i<t.length;i++)map.removeLayer(t[i])}