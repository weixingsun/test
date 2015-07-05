if(Ti.Platform.osname = "android"){
	Ti.include('ui/android/map.js');
}else{
	//Ti.include('ui/ios/map.js');
}
Ti.include('util/net.js');