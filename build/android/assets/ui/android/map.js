var win=Ti.UI.createWindow({backgroundColor:"white"}),mf=require("sc.mapsforge"),mapView=mf.createMapsforgeView({scalebar:!0,minZoom:4,maxZoom:20,centerLatlng:[-43.524551,172.58346],zoomLevel:12,debug:!1});win.add(mapView),win.open(),Ti.API.info("mapView: "+JSON.stringify(mapView)),mapView.addLayer({name:"osm",url:"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",subdomains:["a","b"],parallelRequests:2,maxZoom:"20",minZoom:"4"});var actionBar=win.activity.actionBar;"undefined"!=typeof actionBar&&actionBar.hide();