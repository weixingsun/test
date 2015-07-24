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
	Ti.include('ui/android/map.js');
}else{
	//Ti.include('ui/ios/map.js');
}
