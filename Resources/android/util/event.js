
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

function addActionListeners(module,map){
	Ti.App.addEventListener('clicked', function(e) {
		var latlng=[e.lat,e.lng];
		//var xy=[e.x,e.y];
	    //var p = findPOI(point,radius);
	    var markerTap = findSavedMarker(latlng);//{mk:0,latlng:[0,0]};
	    if(markerTap!== null) changeDestination([markerTap.lat,markerTap.lng]);
	    //animateTo(point);
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