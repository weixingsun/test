function initNav(e){e.load(Ti.App.id+"/gh/nz/")}function navi(e,i,t,n){var o=Ti.App.Properties.getString("by"),a={vehicle:o,from:t,to:n};e.getRouteAsyncCallback(a,function(e){if(0==e.error){removePrevRoute();var t=i.createPolyline({latlngs:e.pts,color:"blue",strokeWidth:10});savePolylineId(t.id),saveRouteInfo(e.nodes),addNodeMarkers(),setNaviMode(1),win.setKeepScreenOn(!0),setEmptyPlayedList(e.nodes)}else Ti.API.info("navi error:"+e.errmsg)})}function naviGoogle(e,i,t){var n=Ti.Network.createHTTPClient(),o="http://maps.googleapis.com/maps/api/directions/json?sensor=false&",a=o+"origin="+i.lat+","+i.lng+"&destination="+t.lat+","+t.lng;Ti.API.info(a),n.open("GET",a),n.onload=function(){var i=JSON.parse(this.responseText);if(i.routes.length>0){var t=createRouteData(i),n=e.createRoute({name:"navi",points:t,color:"red",width:10});addGoogleRoute(n)}},n.send()}var createRouteData=function(e){var i,t=e.routes[0].overview_polyline.points,n=[],o=0,a=0;for(i=decodeLine(t),a=i.length,o=0;a>o;o+=1)null!=i[o]&&n.push({latitude:i[o][0],longitude:i[o][1]});return n},decodeLine=function(e){for(var i=e.length,t=0,n=[],o=0,a=0;i>t;){var r,l=0,d=0;do r=e.charCodeAt(t++)-63,d|=(31&r)<<l,l+=5;while(r>=32);var s=1&d?~(d>>1):d>>1;o+=s,l=0,d=0;do r=e.charCodeAt(t++)-63,d|=(31&r)<<l,l+=5;while(r>=32);var c=1&d?~(d>>1):d>>1;a+=c,n.push([1e-5*o,1e-5*a])}return n};