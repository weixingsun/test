function appEventListeners(){var e=Ti.Android.currentActivity;e.addEventListener("create",function(){Ti.API.info("*** Create Event Called ***")}),e.addEventListener("start",function(){Ti.API.info("*** Start Event Called ***")}),e.addEventListener("stop",function(){Ti.API.info("*** Stop Event Called ***")}),e.addEventListener("resume",function(){Ti.API.info("*** Resume Event Called ***")}),e.addEventListener("pause",function(){Ti.API.info("*** Pause Event Called ***")}),e.addEventListener("destroy",function(){Ti.API.info("*** Destroy Event Called ***")});var i=Ti.Android.createBroadcastReceiver({onReceived:function(){Ti.API.info("Handling broadcast ACTION_SCREEN_OFF.")}});Ti.Android.registerBroadcastReceiver(i,[Ti.Android.ACTION_SCREEN_OFF]);var n=Ti.Android.createBroadcastReceiver({onReceived:function(){Ti.API.info("Handling broadcast ACTION_SCREEN_ON."),map.centerLatlng=getCurrentPos()}});Ti.Android.registerBroadcastReceiver(n,[Ti.Android.ACTION_SCREEN_ON])}function changeDestination(e){setDestinatePos(e),removePrevDestMarker();var i=Ti.App.Android.R.drawable.marker_tap_long,n=addMarker(map,e,i);Ti.App.Properties.setInt("dest_marker",n),hidePopView(),showPopView(e),Ti.API.info("changeDestination() to "+e)}function addActionListeners(){Ti.App.addEventListener("clicked",function(e){var i=[e.lat,e.lng],n=findSavedMarker(i);null!==n&&changeDestination(n.latlng),hideSuggestList(),hideKeyboard()}),Ti.App.addEventListener("longclicked",function(e){var i=getCurrentPos(),n=[e.lat,e.lng];Ti.API.info("longclicked:"+n),0==i[0]||0==i[1]?Ti.API.info("GPS not available"):changeDestination(n)})}