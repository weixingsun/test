var module = require('ti.map');
//var mapview = module.createView({mapType:module.NORMAL_TYPE});

var win = Ti.UI.createWindow({backgroundColor: 'white'});
var map1 = module.createView({
    userLocation: true,
    mapType: module.NORMAL_TYPE,
    animate: true,
    region: {latitude: -33.87365, longitude: 151.20689, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    height: '50%',
    top: 0,
    left: 0,
    width: '50%'
});
var map2 = module.createView({
    userLocation: true,
    mapType: module.TERRAIN_TYPE,
    animate: true,
    region: {latitude: -33.87365, longitude: 151.20689, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    height: '50%',
    top: 0,
    right: 0,
    width: '50%'
});
var map3 = module.createView({
    userLocation: true,
    mapType: module.SATELLITE_TYPE,
    animate: true,
    region: {latitude: -33.87365, longitude: 151.20689, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    height: '50%',
    bottom: 0,
	left: 0,
    width: '50%'
});
var map4 = module.createView({
    userLocation: true,
    mapType: module.HYBRID_TYPE,
    animate: true,
    region: {latitude: -33.87365, longitude: 151.20689, latitudeDelta: 0.1, longitudeDelta: 0.1 },
    height: '50%',
    bottom: 0,
    right: 0,
    width: '50%',
    traffic: true
});
win.add(map1);
win.add(map2);
win.add(map3);
win.add(map4);
win.open();