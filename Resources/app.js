//sun.wsn.app.map
Ti.include('util/acra.js');
initACRA();
crash();

if(Ti.Platform.osname = "android"){
	Ti.include('map.js');
	Ti.include('tool.js');
	Ti.include('net.js');
	Ti.include('views.js');
	Ti.include('places.js');
	Ti.include('audio.js');
	var net = new Net();
	var places = new Places();
	var views  = new Views();
	var audio = new Audio();
	audio.init();
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
			var map = new Mapsforge();
		}else{
			Ti.API.info('use online google map');
			Ti.include('googlemap.js');
			var map = new GoogleMap();
		}
		map.init();
	}else{
		Ti.API.info('use online google map');
		Ti.include('googlemap.js');
		var map = new GoogleMap();
		map.init();
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
