var locationAdded = false;
var GPS_RANGE_MIN = 30;
//var GPS_RANGE_MIN = 30;
var GPS_RANGE_MAX = 200;

function getCurrentPosDict(){
	return {
		lat:Ti.App.Properties.getDouble("gps_lat"),
		lng:Ti.App.Properties.getDouble("gps_lng"),
	};
}
function getCurrentPos(){
	return [Ti.App.Properties.getDouble("gps_lat"),Ti.App.Properties.getDouble("gps_lng")];
}
function getDestinatePos(){
	return [Ti.App.Properties.getDouble("dest_lat"),Ti.App.Properties.getDouble("dest_lng")];
}
function setDestinatePos(p){
	Ti.App.Properties.setDouble("dest_lat",p[0]);
	Ti.App.Properties.setDouble("dest_lng",p[1]);
}
//function handleLocation(e) {
var locationCallback = function(e) {
    if (!e.error) {
        Ti.App.Properties.setDouble("gps_lng",e.coords.longitude);
	    Ti.App.Properties.setDouble("gps_lat",e.coords.latitude);
	    Ti.App.Properties.setInt("heading",e.coords.heading);
	    Ti.App.Properties.setInt("gps_accuracy",e.coords.accuracy);
	    Ti.App.Properties.setInt("speed",e.coords.speed);
	    //e.coords.altitude/e.coords.timestamp/e.coords.altitudeAccuracy
	    var me = [e.coords.latitude,e.coords.longitude];
	    if(!isGoogleMap()) addMyLocMarker(me,e.coords.accuracy);
		var strNodes = getNodes();
	    var mode = Ti.App.Properties.getInt("MODE");
	    if(strNodes.length<1 || mode==0){
	    	return;
	    }else{
	    	animateTo(me);
	    }
    	//Ti.API.info("handleLocation()done with location, start deal with route");
	    var nextNode,stepId;
	    var strNodes = getNodes(); //[[172.584333,-43.523472],[172.584716,-43.523578]]
	    var nodes = JSON.parse(strNodes);
		var range = (e.coords.accuracy < GPS_RANGE_MIN) ? GPS_RANGE_MIN : e.coords.accuracy;
	    try {
		    stepId = findMyStepId(nodes, me, range);
		    nextNode = findNextNode(nodes,stepId);
		    //throw "err_content"; err="err_content"
		}catch(err) {
    		Ti.API.info("handleLocation()err:"+err.message+", "+strNodes);
		}
		if(typeof nextNode !=='undefined'){
			var nextPoint = nextNode.pts[0];
		    var dist2next = distance(me[0],me[1],nextPoint[1],nextPoint[0]);
		    instruction(stepId,nextNode,dist2next);
		}else{
			//redraw route
			//var nextPoint = nextNode.pts[0];
		    //var dist2next = distance(me[0],me[1],nextPoint[1],nextPoint[0]);
			//showToast(-1,-1,-1);
			var toast = Titanium.UI.createNotification({
				duration: Ti.UI.NOTIFICATION_DURATION_SHORT,
				message: 'redraw route?range='+range+',accuracy='+e.coords.accuracy,
			});
			toast.show();
		}
    }
};
function findNextNode(nodes,currId){
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
function instruction(stepId,nextNode,dist){
	var msg = '';
	if(stepId>-1){
		var dict = getGHDict();
		var dist00 = Math.round(dist/100)*100;//ceil/floor/round
		var turn = dict[''+nextNode.sign];
		var playOrNot = true;
    	if(!isPlayed(stepId,dist00)){
			Ti.API.info('dist='+dist00+",stepId="+stepId+" turn="+turn+", nextNode:"+JSON.stringify(nextNode));
			playOrNot = play(turn,dist00);
			if(playOrNot) setPlayedList(stepId,dist00);
		}
		msg='step '+ stepId+', '+dist00+'m('+dist+'), turn ' +turn+', on '+nextNode.name +', play='+playOrNot;
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
function checkStep(navimodule,me,nodePts,range){
	var isIn = navimodule.isInStep({
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
	//Ti.Geolocation.distanceFilter = 10; //drop event accuracy >10m
	//Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
	Ti.Geolocation.Android.manualMode = true;
    var gpsProvider = Ti.Geolocation.Android.createLocationProvider({
        name: Ti.Geolocation.PROVIDER_GPS,
        minUpdateTime: '2',//'5.0'
        //minUpdateDistance: 10,
    });
    Ti.Geolocation.Android.addLocationProvider(gpsProvider);
    var gpsRule = Ti.Geolocation.Android.createLocationRule({
        provider: Ti.Geolocation.PROVIDER_GPS,
        //accuracy: 20, // in meters
        maxAge: (1000 * 3),
        minAge: (1000 * 2),
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
		  accuracy: 20,
		  maxAge: 3*1000,
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
