//sun.wsn.app.map
Ti.include('util/vars.js');
Ti.include('util/gps.js');
Ti.include('util/views.js');
Ti.include('util/routeview.js');
Ti.include('util/placeview.js');
Ti.include('util/net.js');
Ti.include('util/event.js');
Ti.include('util/nav.js');
Ti.include('util/poi.js');
Ti.include('util/audio.js');
Ti.include('util/saved.js');
if(Ti.Platform.osname = "android"){
	var mapPath="map/nz.map";
	if(Ti.Filesystem.isExternalStoragePresent()){
        var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, mapPath);
	}else {// No SD or iOS
		Ti.API.info('applicationDataDirectory='+Ti.Filesystem.applicationDataDirectory+', path='+mapPath);
        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mapPath);
    }
	if(file.exists()){
		Ti.API.info('use offline map' );
		Ti.include('ui/android/mapsforge.js');
	}else{
		Ti.API.info('use online google map' );
		Ti.include('ui/android/googlemap.js');
	}
}else{
	//Ti.include('ui/ios/map.js');
}
