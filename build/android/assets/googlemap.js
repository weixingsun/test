function initWindow(){return Ti.UI.createWindow()}function initWindowEvent(e){e.addEventListener("focus",function(){hideBar(e);createPlaceView()})}function hideBar(e){var i=e.activity.actionBar;"undefined"!=typeof i&&i.hide()}function initGoogleModule(){return require("ti.map")}function initGraphhopperModule(){return require("ti.mapsforge")}function initGoogleMap(e,i){var t=Ti.App.Properties.getDouble("gps_lng",0),o=Ti.App.Properties.getDouble("gps_lat",0),n=i.createView({userLocation:!0,mapType:i.NORMAL_TYPE,region:{latitude:o,longitude:t,latitudeDelta:.1,longitudeDelta:.1},height:"100%",width:"100%",top:0,left:0});return addGmapActionListeners(n),e.add(n),e.open(),n}function addGmapActionListeners(e){e.addEventListener("click",function(e){var i=e.longitude,t=e.latitude;Ti.API.info("map.clicked:"+t+","+i)}),e.addEventListener("longclick",function(i){removePrevRouteGoogle();var t=[i.latitude,i.longitude],o=getCurrentPos();addGoogleMarker(t[0],t[1],Ti.App.Android.R.drawable.marker_tap),naviGoogle(module,o,t),navi(graph,e,o,t)}),e.addEventListener("complete",function(){Ti.API.info("map load complete")})}function addGoogleMarker(e,i,t){var o={latitude:e,longitude:i,animate:!0,image:t,draggable:!0},n=module.createAnnotation(o);map.addAnnotation(n)}function removeMarkerGoogle(){map.removeRoute(route)}function addGoogleRoute(e){map.addRoute(e)}function removeRouteGoogle(e){map.removeRoute(e)}var map_type="google.normal";initVars(map_type);var win=initWindow();initWindowEvent(win);var module=initGoogleModule(),graph=initGraphhopperModule(),map=initGoogleMap(win,module);initNav(graph);