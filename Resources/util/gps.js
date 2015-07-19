var locationAdded = false;
var GPS_RANGE = 50;

function handleLocation(e) {
    if (!e.error) {
        //Ti.API.info("location: "+e.coords.longitude+","+e.coords.latitude+"("+e.coords.accuracy+")   time:"+e.coords.timestamp);
	    Ti.App.Properties.setDouble("lng",e.coords.longitude);
	    Ti.App.Properties.setDouble("lat",e.coords.latitude);
	    Ti.App.Properties.setInt("heading",e.coords.heading);
	    Ti.App.Properties.setInt("accuracy",e.coords.accuracy);
	    Ti.App.Properties.setInt("speed",e.coords.speed);
	    //var altitude = e.coords.altitude;
	    //var timestamp = e.coords.timestamp;
	    //var altAccuracy = e.coords.altitudeAccuracy;
	    var me = [e.coords.latitude,e.coords.longitude];
	    addMyLocMarker(me,e.coords.accuracy);
		var strNodes = getNodes();
	    var mode = Ti.App.Properties.getInt("MODE");
	    if(strNodes.length<1 || mode==0){
	    	return;
	    }
	    var nextNode,stepId;
	    try {
		    var range = (e.coords.accuracy*2 > GPS_RANGE) ? GPS_RANGE : e.coords.accuracy*2;
		    stepId = findMyStep(me, range);
		    nextNode = findNextNode(stepId,me);
		    //throw "err_content"; err="err_content"
		}catch(err) {
    		Ti.API.info("handleLocation():"+strNodes+", "+err.message);
		}
		if(typeof nextNode !=='undefined'){
			var nextPoint = nextNode.pts[0];
		    var dist2next = distance(me[0],me[1],nextPoint[1],nextPoint[0]);
		    showToast(stepId,nextNode,dist2next);
		}else{
			//redraw route
			showToast(-1,-1,-1);
		}
    }
};
function findNextNode(currId,me){
	var strNodes = getNodes();
	var nodes = JSON.parse(strNodes);
	var p0 = nodes[0].pts[0];
	var d0 = distance(me[0],me[1],p0[1],p0[0]); //to starting point
	var nextNode;
	if(currId<0){
		if(d0<GPS_RANGE) return nodes[0];
	}else if(currId+1<nodes.length){
		nextNode = nodes[currId+1];
		Ti.API.info("nextPoint="+JSON.stringify(nextNode.pts[0]));
	}
	return nextNode;
}

function findMyStep(me,range){
	var strme = JSON.stringify(me);
    var strNodes = getNodes();
	//strNodes=[[172.584333,-43.523472],[172.584716,-43.523578]]
    var nodes = JSON.parse(strNodes);
    return findMyStepId(strme, nodes, range);
}
function findMyStepId(strme, nodes, range){
	//var nodes = JSON.parse(strNodes);
	var inWhichStep = -1;
	for (var i = 0; i < nodes.length; i++){
      var strNodePts = JSON.stringify(nodes[i].pts);
      var isIn = checkStep(strme,strNodePts,range);
      if(isIn) {
      	inWhichStep=i;
      	break;
      }
    }
    return inWhichStep;
}
function showToast(inWhichStep,nextNode,dist){
	var msg = '';
	if(inWhichStep>-1){
		msg='in '+dist+'m, turn ' +nextNode.sign+ +', on '+nextNode.name+', in step '+ inWhichStep;
	}else if(dist>0){
		msg='not in any step';
	}
	var toast = Titanium.UI.createNotification({
		duration: Ti.UI.NOTIFICATION_DURATION_SHORT,
		message: msg
	});
	toast.show();
}
function checkStep(me,nodePts,range){
	var isIn = mf.isInStep({
		"range": range,
		"point": me,
		"points": nodePts //in meter
	});
	return isIn;
};
function addMyLocMarker(me,accuracy){
	///////////////////map.updateLayer()
	if(Ti.App.Properties.getInt("myCircle") !== 0 || Ti.App.Properties.getInt("mySpot") !== 0){
    	//map.removeLayer(Ti.App.Properties.getInt("myCircle"));
    	//map.removeLayer(Ti.App.Properties.getInt("mySpot"));
    	map.updateLayer({
    		"id":Ti.App.Properties.getInt("myCircle"),
    		"type":"circle",
    		"latlng":me,
    		"radius":accuracy,
    		"move":1
    	});
    	map.updateLayer({
    		"id":Ti.App.Properties.getInt("mySpot"),
    		"type":"marker",
    		"latlng":me,
    		"move":1
    	});
    }else{
	    var myCircle = map.createCircle({
			"latlng": me,
			"colorHex": "#33000099",
			"radius": accuracy //in meter
		});
		var mySpot = map.createMarker({
			"iconPath": Ti.App.Android.R.drawable.me_point_blue_1,
			"latlng": me
	    });
	    Ti.App.Properties.setInt("mySpot",mySpot.id);
	    Ti.App.Properties.setInt("myCircle",myCircle.id);
	}
}
function addHandler() {
    if (!locationAdded) {
		Ti.API.info("setup gps handler 2");
        Ti.Geolocation.addEventListener('location', handleLocation);
        locationAdded = true;
    }
};
function removeHandler() {
    if (locationAdded) {
		Ti.API.info("removeHandler gps");
        Ti.Geolocation.removeEventListener('location', handleLocation);
        locationAdded = false;
    }
};

function initGPS(){
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	Ti.Geolocation.distanceFilter = 100; //drop event accuracy >100m
	//Titanium.Geolocation.frequency = 2000;
	Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.API.info("setup gps handler 1");
	    addHandler();
	    //var activity = Ti.Android.currentActivity;
	    //activity.addEventListener('destroy', removeHandler);
	    //activity.addEventListener('pause', removeHandler);
	    //activity.addEventListener('resume', addHandler);
	} else {
	    alert('Please enable location services');
	}
}
function distance(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var a = 0.5 - Math.cos((lat2 - lat1) * Math.PI / 180)/2 + 
     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
     (1 - Math.cos((lon2 - lon1) * Math.PI / 180))/2;
  var m = R * 2 * Math.asin(Math.sqrt(a))*1000;
  return m.toFixed(0);
}
