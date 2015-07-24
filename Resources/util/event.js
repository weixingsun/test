
function appEventListeners(){
	var activity = Ti.Android.currentActivity;
	activity.addEventListener('create', function() {
	    Ti.API.info('*** Create Event Called ***');
	});
	activity.addEventListener('start', function() {
	    Ti.API.info('*** Start Event Called ***');
	});
	activity.addEventListener('stop', function() {
	    Ti.API.info('*** Stop Event Called ***');
	    //hidePopView();
	});
	activity.addEventListener('resume', function() {
	    Ti.API.info('*** Resume Event Called ***');
	});
	activity.addEventListener('pause', function() {
	    Ti.API.info('*** Pause Event Called ***');
	    //hidePopView();
	});
	activity.addEventListener('destroy', function() {
	    Ti.API.info('*** Destroy Event Called ***');
	});
	
	var dspoff = Ti.Android.createBroadcastReceiver({
	    onReceived: function() {
	        Ti.API.info('Handling broadcast ACTION_SCREEN_OFF.');
	    	//hidePopView();
	    }
	});
	Ti.Android.registerBroadcastReceiver(dspoff, [Ti.Android.ACTION_SCREEN_OFF]);
	
	var dspon = Ti.Android.createBroadcastReceiver({
	    onReceived: function() {
	        Ti.API.info('Handling broadcast ACTION_SCREEN_ON.');
	    	map.centerLatlng = getCurrentPos();
	    }
	});
	Ti.Android.registerBroadcastReceiver(dspon, [Ti.Android.ACTION_SCREEN_ON]);
}
function changeDestination(point){
	setDestinatePos(point);
	removePrevDestMarker();
	var id=Ti.App.Android.R.drawable.marker_tap_long;
	var mkid = addMarker(map,point,id);
	Ti.App.Properties.setInt("dest_marker",mkid);
	hidePopView();
	showPopView(point);
	move(point);
}
function addActionListeners(module,map){
	Ti.App.addEventListener('clicked', function(e) {
		var resid = Ti.App.Android.R.drawable.marker_tap;
		var point=[e.lat,e.lng];
		Ti.API.info('clicked:' +point);
	    //var p = findPOI(point,radius);
	    //var pop = AllViews["pop"];
	    //showPopView();
	    findSavedMarker(point);
	    hideSuggestList();
	    hideKeyboard();
	});
	Ti.App.addEventListener('longclicked', function(e) {
		var from = getCurrentPos();
		var to = [e.lat,e.lng];
		Ti.API.info('longclicked:'+to);
		if(from[0]==0 || from[1]==0){
			Ti.API.info('GPS not available');
		}else{
   			changeDestination(to);
		}
	});
}