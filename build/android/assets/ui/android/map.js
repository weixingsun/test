function removePrevDestMarker(){var e=ALL.Marker.dest;0!==e&&mapView.removeLayer(e)}function marker(e){var a=mapView.createMarker({iconPath:Ti.App.Android.R.drawable.marker_tap,latlng:e});ALL.Marker.dest=a.id}function navi(e,a){var i={weighting:"fastest",vehicle:"car",from:e,to:a,debug:!1};mf.getRouteAsyncCallback(i,function(e){if(0==e.error){var a=ALL.Line.route;0!==a&&mapView.removeLayer(a);var i=mapView.createPolyline({latlngs:e.pts,color:"blue",strokeWidth:10});ALL.Line.route=i.id,ALL.Nodes=e.nodes}})}var ALL={Marker:{dest:0},Gps:{lat:0,lng:0,heading:0,accuracy:0,speed:0},Line:{route:0},Nodes:{}},win=Ti.UI.createWindow({backgroundColor:"white"}),mf=require("ti.mapsforge");mf.load("/osmdroid/maps/nz/");var mapView=mf.createMapsforgeView({scalebar:!0,minZoom:5,maxZoom:20,centerLatlng:[-43.524551,172.58346],zoomLevel:12,debug:!1});win.add(mapView),win.open(),Ti.API.info("mapView: "+JSON.stringify(mapView)),Ti.App.addEventListener("clicked",function(e){Ti.App.Android.R.drawable.marker_tap;alert("clicked("+e.lat+","+e.lng+")")}),Ti.App.addEventListener("longclicked",function(e){Ti.API.info("longclicked("+e.lat+","+e.lng+")");var a=[-43.524551,172.58346],i=[e.lat,e.lng];navi(a,i),removePrevDestMarker(),marker(i)}),mapView.addLayer({name:"osm",path:"osmdroid/maps/nz/nz.map"});var actionBar=win.activity.actionBar;"undefined"!=typeof actionBar&&actionBar.hide();