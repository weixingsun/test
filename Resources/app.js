Ti.include('util/vars.js');
Ti.include('util/views.js');
Ti.include('util/net.js');
Ti.include('util/gps.js');
if(Ti.Platform.osname = "android"){
	Ti.include('ui/android/map.js');
}else{
	//Ti.include('ui/ios/map.js');
}