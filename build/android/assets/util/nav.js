function navi(e,i,t,n){var o=Ti.App.Properties.getString("by"),a={weighting:"fastest",vehicle:o,from:t,to:n};e.getRouteAsyncCallback(a,function(e){if(0==e.error){removePrevRoute();var t=i.createPolyline({latlngs:e.pts,color:"blue",strokeWidth:10});Ti.App.Properties.setInt("route",t.id),Ti.App.Properties.setString("Nodes",JSON.stringify(e.nodes)),addNodeMarkers(),Ti.App.Properties.setInt("MODE",1),win.setKeepScreenOn(!0)}else Ti.API.info("navi error:"+e.error)})}