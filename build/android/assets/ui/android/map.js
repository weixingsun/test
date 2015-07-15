function initWindowEvent(e){e.addEventListener("focus",function(){hideBar(e)})}function hideBar(e){var i=e.activity.actionBar;Ti.API.info("actionBar:"+i),"undefined"!=typeof i&&i.hide()}function initWindow(){return Ti.UI.createWindow()}function initModule(){return require("ti.mapsforge")}function initVar(){var e={Marker:{dest:0},Gps:{lat:0,lng:0,heading:0,accuracy:0,speed:0},Line:{route:0},Nodes:{}};return e}function initMap(e,i){var n=i.createMapsforgeView({scalebar:!0,minZoom:5,maxZoom:20,centerLatlng:[-43.524551,172.58346],zoomLevel:12,debug:!1});return e.add(n),e.open(),n}function addOfflineMapLayer(e){e.addLayer({name:"osm",path:"osmdroid/maps/nz/nz.map"})}function initNav(e){e.load("/osmdroid/maps/nz/")}function initMapListener(e,i,n){Ti.App.addEventListener("viewCreated",function(){Ti.API.info("mapCreated: received by js"),addOfflineMapLayer(n),addActionListeners(i,n)})}function addActionListeners(e,i){Ti.App.addEventListener("clicked",function(e){var i=(Ti.App.Android.R.drawable.marker_tap,[e.lat,e.lng]);Ti.API.info("clicked"+i)}),Ti.App.addEventListener("longclicked",function(n){Ti.API.info("longclicked("+n.lat+","+n.lng+")");var a=[-43.524551,172.58346],r=[n.lat,n.lng];navi(e,i,a,r),removePrevDestMarker(i),addMarker(i,r)})}function removePrevDestMarker(e){var i=ALL.Marker.dest;0!==i&&e.removeLayer(i)}function addMarker(e,i){var n=e.createMarker({iconPath:Ti.App.Android.R.drawable.marker_tap,latlng:i});ALL.Marker.dest=n.id}function navi(e,i,n,a){var r={weighting:"fastest",vehicle:"car",from:n,to:a,debug:!1};e.getRouteAsyncCallback(r,function(e){if(0==e.error){var n=ALL.Line.route;0!==n&&i.removeLayer(n);var a=i.createPolyline({latlngs:e.pts,color:"blue",strokeWidth:10});ALL.Line.route=a.id,ALL.Nodes=e.nodes}})}var ALL=initVar(),win=initWindow();initWindowEvent(win);var mf=initModule(),map=initMap(win,mf);initMapListener(win,mf,map),initNav(mf);