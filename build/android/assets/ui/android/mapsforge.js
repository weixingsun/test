function initWindowEvent(i){i.addEventListener("focus",function(){hideBar(i);var e=createPlaceView();Ti.App.Properties.setObject("pop",e)})}function hideBar(i){var e=i.activity.actionBar;"undefined"!=typeof e&&e.hide()}function initWindow(){return Ti.UI.createWindow()}function initModule(){return require("ti.mapsforge")}function initMap(i,e){var a=Ti.App.Properties.getDouble("gps_lng",0),n=Ti.App.Properties.getDouble("gps_lat",0),t=e.createMapsforgeView({scalebar:!0,minZoom:5,maxZoom:20,centerLatlng:[n,a],zoomLevel:16,debug:!1});return i.add(t),i.open(),t}function move(i){map.centerLatlng=i}function animateTo(i){map.animateTo(i)}function addOfflineMapLayer(i){i.addLayer({name:"osm",path:Ti.App.id+"/map/nz.map"})}function initNav(i){i.load(Ti.App.id+"/gh/nz/")}function initMapListener(i,e,a){Ti.App.addEventListener("viewCreated",function(){Ti.API.info("mapCreated: received by js"),addOfflineMapLayer(a),addActionListeners(e,a),initGPS(),showAllSavedPlaceMarkers()})}function addMarker(i,e,a){var n=i.createMarker({iconPath:a,latlng:e});return n.id}function removeLayer(i){map.removeLayer(i)}initVars();var win=initWindow();initWindowEvent(win);var mf=initModule(),map=initMap(win,mf);initMapListener(win,mf,map),initNav(mf),appEventListeners(),createAndroidSearchBar(),createSavedPlaceTable();