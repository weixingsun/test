//sun.wsn.app.map
Ti.include('util/acra.js');
initACRA();
crash();

if(Ti.Platform.osname = "android"){
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
	//////////////////////////////////////////////////////////////////////////
	if(Ti.Network.networkType == Ti.Network.NETWORK_NONE){
		var mapPath="map/nz.map";
		if(Ti.Filesystem.isExternalStoragePresent()){
	        var file = Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, mapPath);
		}else {// No SD
			Ti.API.info('applicationDataDirectory='+Ti.Filesystem.applicationDataDirectory+', path='+mapPath);
	        var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mapPath);
	    }
		if(file.exists()){
			Ti.API.info('use offline map');
			Ti.include('mapsforge.js');
		}else{
			Ti.API.info('use online google map');
			Ti.include('googlemap.js');
		}
	}else{
		Ti.API.info('use online google map');
		Ti.include('googlemap.js');
	}
}else{
	//iOS
	var mapPath="map/nz.map";
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, mapPath);
	if(file.exists()){
		Ti.API.info('use offline map in ios');
		Ti.include('mapsforge.js');
	}else{
		Ti.API.info('use online google map in ios');
		Ti.include('googlemap.js');
	}
}
