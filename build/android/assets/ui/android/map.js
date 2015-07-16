function initWindowEvent(e){e.addEventListener("focus",function(){hideBar(e)})}function hideBar(e){var i=e.activity.actionBar;"undefined"!=typeof i&&i.hide()}function initWindow(){return Ti.UI.createWindow()}function initModule(){return require("ti.mapsforge")}function initVar(){var e={Marker:{mySpot:0,myCircle:0,dest:0},Gps:{lat:0,lng:0,heading:0,accuracy:0,speed:0},Line:{route:0},Nodes:{}};return e}function initMap(e,i){var n=i.createMapsforgeView({scalebar:!0,minZoom:5,maxZoom:20,centerLatlng:[-43.524551,172.58346],zoomLevel:12,debug:!1});return e.add(n),e.open(),n}function addOfflineMapLayer(e){e.addLayer({name:"osm",path:"osmdroid/maps/nz/nz.map"})}function initNav(e){e.load("/osmdroid/maps/nz/")}function initMapListener(e,i,n){Ti.App.addEventListener("viewCreated",function(){Ti.API.info("mapCreated: received by js"),addOfflineMapLayer(n),addActionListeners(i,n),initGPS()})}function addActionListeners(e,i){Ti.App.addEventListener("clicked",function(e){var i=(Ti.App.Android.R.drawable.marker_tap,[e.lat,e.lng]);Ti.API.info("clicked"+i)}),Ti.App.addEventListener("longclicked",function(n){if(Ti.API.info("longclicked("+n.lat+","+n.lng+")"),0==ALL.Gps.lat||0==ALL.Gps.lng)Ti.API.info("GPS not available");else{var a=[ALL.Gps.lat,ALL.Gps.lng],t=[n.lat,n.lng];navi(e,i,a,t),removePrevDestMarker(i),addMarker(i,t),addNodeMarkers()}})}function removePrevDestMarker(e){0!==ALL.Marker.dest&&e.removeLayer(ALL.Marker.dest)}function addMarker(e,i){var n=e.createMarker({iconPath:Ti.App.Android.R.drawable.marker_tap_long,latlng:i});ALL.Marker.dest=n.id}function addNodeMarkers(){ALL.Nodes.length;for(node in ALL.Nodes)node.pts,node.sign}function navi(e,i,n,a){var t={weighting:"fastest",vehicle:"car",from:n,to:a,debug:!1};e.getRouteAsyncCallback(t,function(e){if(0==e.error){var n=ALL.Line.route;0!==n&&i.removeLayer(n);var a=i.createPolyline({latlngs:e.pts,color:"blue",strokeWidth:10});ALL.Line.route=a.id,ALL.Nodes=e.nodes}})}var ALL=initVar(),win=initWindow();initWindowEvent(win);var mf=initModule(),map=initMap(win,mf);initMapListener(win,mf,map),initNav(mf);