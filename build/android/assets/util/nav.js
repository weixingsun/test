function navi(e,i,t,n){var a=Ti.App.Properties.getString("by"),o={weighting:"fastest",vehicle:a,from:t,to:n};e.getRouteAsyncCallback(o,function(e){if(0==e.error){removePrevRoute();var t=i.createPolyline({latlngs:e.pts,color:"blue",strokeWidth:10});Ti.App.Properties.setInt("route",t.id),Ti.App.Properties.setString("Nodes",JSON.stringify(e.nodes)),addNodeMarkers(),Ti.App.Properties.setInt("MODE",1),win.setKeepScreenOn(!0),setEmptyPlayedList(e.nodes)}else Ti.API.info("navi error:"+e.error)})}