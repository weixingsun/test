var locationAdded = false;
var GPS_RANGE_MIN = 60;
//var GPS_RANGE_MIN = 30;
var GPS_RANGE_MAX = 200;

//function handleLocation(e) {
var locationCallback = function(e) {
    if (!e.error) {
        //Ti.API.info("location: "+e.coords.longitude+","+e.coords.latitude+"("+e.coords.accuracy+")   time:"+e.coords.timestamp);
	    Ti.App.Properties.setDouble("gps_lng",e.coords.longitude);
	    Ti.App.Properties.setDouble("gps_lat",e.coords.latitude);
	    Ti.App.Properties.setInt("heading",e.coords.heading);
	    //Ti.App.Properties.setInt("gps_accuracy",e.coords.accuracy);
	    Ti.App.Properties.setInt("speed",e.coords.speed);
	    //var altitude = e.coords.altitude;
	    //var timestamp = e.coords.timestamp;
	    //var altAccuracy = e.coords.altitudeAccuracy;
	    var me = [e.coords.latitude,e.coords.longitude];
	    addMyLocMarker(me,e.coords.accuracy);
		var strNodes = getNodes();
    	Ti.API.info("handleLocation()done with location, start deal with route");
	    var mode = Ti.App.Properties.getInt("MODE");
	    if(strNodes.length<1 || mode==0){
	    	return;
	    }else{
	    	map.centerLatlng = me;
	    }
    	
	    var nextNode,stepId;
	    var strNodes = getNodes();
		//strNodes=[[172.584333,-43.523472],[172.584716,-43.523578]]
	    var nodes = JSON.parse(strNodes);
	    try {
		    var range = (e.coords.accuracy < GPS_RANGE_MIN) ? GPS_RANGE_MIN : e.coords.accuracy;
		    stepId = findMyStepId(nodes, me, range);
		    nextNode = findNextNode(nodes,stepId);
		    //throw "err_content"; err="err_content"
		}catch(err) {
    		Ti.API.info("handleLocation()err:"+err.message+", "+strNodes);
		}
		if(typeof nextNode !=='undefined'){
			var nextPoint = nextNode.pts[0];
		    var dist2next = distance(me[0],me[1],nextPoint[1],nextPoint[0]);
		    showToast(stepId,nextNode,dist2next);
		}else{
			//redraw route
			//var nextPoint = nextNode.pts[0];
		    //var dist2next = distance(me[0],me[1],nextPoint[1],nextPoint[0]);
			//showToast(-1,-1,-1);
			var toast = Titanium.UI.createNotification({
				duration: Ti.UI.NOTIFICATION_DURATION_SHORT,
				message: 'redraw route?'
			});
			toast.show();
		}
    }
};
function findNextNode(nodes,currId){
	//if(currId<0){		//if no nodeId
	//	return nodes[0];
	//}else 
	if(currId+1<nodes.length){
		return nodes[currId+1];
	}else{//last node
		return nodes[currId];
	}
}

function findMyStepId(nodes, me, range){
	//var nodes = JSON.parse(strNodes);
	var strme = JSON.stringify(me);
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
		var strdict = Ti.App.Properties.getString('GH_TURN_DICT');
		var dict = JSON.parse(strdict);
		var turn = dict[''+nextNode.sign];
		msg='in '+dist+'m, turn ' +turn+', on '+nextNode.name+', in step '+ inWhichStep;
	}else if(dist>0){
		msg='dist='+dist+',but not in any step';
	}else{
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
function removeHandler() {
		Ti.API.info("removeHandler gps");
        Ti.Geolocation.Android.removeEventListener('location', locationCallback);
};

function initGPS(){
	//Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
	//Ti.Geolocation.distanceFilter = 50; //drop event accuracy >50m
	//Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
	Ti.Geolocation.Android.manualMode = true;
    var gpsProvider = Ti.Geolocation.Android.createLocationProvider({
        name: Ti.Geolocation.PROVIDER_GPS,
        minUpdateTime: 2,
        minUpdateDistance: 50
    });
    Ti.Geolocation.Android.addLocationProvider(gpsProvider);
    var gpsRule = Ti.Geolocation.Android.createLocationRule({
        provider: Ti.Geolocation.PROVIDER_GPS,
        accuracy: 50, // in meters
        maxAge: (1000 * 30),
        minAge: (1000 * 2)
    });
    Ti.Geolocation.Android.addLocationRule(gpsRule);
    var providerNetwork = Ti.Geolocation.Android.createLocationProvider({
	     name: Ti.Geolocation.PROVIDER_NETWORK,
	     //minUpdateDistance: 0.0,
	     //minUpdateTime: 0
	});
	Ti.Geolocation.Android.addLocationProvider(providerNetwork);
	var networkRule = Ti.Geolocation.Android.createLocationRule({
		  provider: Ti.Geolocation.PROVIDER_NETWORK,
		  accuracy: 50,
		  maxAge: 30*1000,
		  minAge: 2*1000,
	});
	Ti.Geolocation.Android.addLocationRule(networkRule);
	if (Ti.Geolocation.locationServicesEnabled) {
		Ti.API.info("gps enabled");
    	Ti.Geolocation.addEventListener('location',locationCallback);
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
