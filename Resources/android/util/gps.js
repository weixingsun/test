var locationAdded = false;
var GPS_RANGE_MIN = 30;
var GPS_RANGE_MAX = 200;
var GPS_RANGE = GPS_RANGE_MIN;

function getCurrentPosDict(){
	return {
		lat:Ti.App.Properties.getDouble("gps_lat"),
		lng:Ti.App.Properties.getDouble("gps_lng"),
	};
}
function getCurrentPos(){
	return [Ti.App.Properties.getDouble("gps_lat",0),Ti.App.Properties.getDouble("gps_lng",0)];
}
function saveGpsData(e){
	Ti.App.Properties.setDouble("gps_lng",e.coords.longitude);
    Ti.App.Properties.setDouble("gps_lat",e.coords.latitude);
    Ti.App.Properties.setInt("heading",e.coords.heading);
    Ti.App.Properties.setInt("gps_accuracy",e.coords.accuracy);
    Ti.App.Properties.setInt("speed",e.coords.speed);
    //e.coords.altitude/e.coords.timestamp/e.coords.altitudeAccuracy
}
function naviOrNot(strNodes){
	var mode = Ti.App.Properties.getInt("MODE");
    if(strNodes.length<1 || mode==0){
    	return false;
    }else{
    	return true;
    }
}
function hint(me,stepId,nextNode){
	var nextPoint = nextNode.pts[0];
    var dist2next = distance(me[0],me[1],nextPoint[1],nextPoint[0]);
    instruction(stepId,nextNode,dist2next);
}
function getRange(accuracy){
	return (accuracy < GPS_RANGE_MIN) ? GPS_RANGE_MIN : accuracy;
}
function drawMyLocMarker(me,accuracy){
    //GoogleMaps contains location marker already
    if(!isGoogleMap()) addMyLocMarker(me,accuracy);
}
//var locationCallback = function(e) {
function locationCallback(e) {
    if (!e.error) {
        saveGpsData(e);
	    var me = [e.coords.latitude,e.coords.longitude];
	    drawMyLocMarker(me,e.coords.accuracy);
    	var strNodes = getNodes();
	    if(naviOrNot(strNodes)){
			var nodes = JSON.parse(strNodes);
	    	animateTo(me);
	    	var stepId = checkOnRoad(nodes,me,e.coords.accuracy);
			if(stepId>-1){
				var nextNode = findNextNode(nodes,stepId);
				hint(me,stepId,nextNode);
			}else{
				reroute();
			}
	    }
		
    }
};
function checkOnRoad(nodes,me,accuracy){
	var range = getRange(accuracy);
	var stepId = findMyStepId(nodes, me, range);
	if(stepId<0){
		stepId = findMyStepId(nodes, me, range+50);
	}
	return stepId;
	//var nextNode = findNextNode(nodes,stepId);
}
function reroute(){
	/*var toast = Titanium.UI.createNotification({
		duration: Ti.UI.NOTIFICATION_DURATION_SHORT,
		message: 'redraw route?range='+range+',accuracy='+e.coords.accuracy,
	});
	toast.show();*/
	if(!ROUTING){
		//play replaning route mp3
		removePrevAll();
		var from = getCurrentPos();
    	var to = getDestinatePos();
    	navi(navimodule,from,to);
	}
}
function findNextNode(nodes,currId){
	if(currId+1<nodes.length){
		return nodes[currId+1];
	}else{//last node
		return nodes[currId];
	}
}

function findMyStepId(nodes, me, range){
	var strme = JSON.stringify(me);
	var inWhichStep = -1;
	for (var i = 0; i < nodes.length; i++){
      var isIn = checkStep(strme, JSON.stringify(nodes[i].pts), range);
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
			//playOrNot = speakMp3(turn,dist00);
			playOrNot = speakInterface(dist00,turn,nextNode.name);
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
function checkStep(me,nodePts,range){
	var isIn = navimodule.isInStep({
		"range": range,
		"point": me,
		"points": nodePts //in meter
	});
	return isIn;
};
function addMyLocMarker(me,accuracy){
	var mk = Ti.App.Properties.getInt("mySpot");
	var cc = Ti.App.Properties.getInt("myCircle");
	if(cc !== 0 || mk !== 0){
    	//map.removeLayer(cc);
    	//map.removeLayer(mk);
    	updateCircle(cc,me,accuracy);
    	updateMarker(mk,me);
    	//Ti.API.info("updating my loc");
    }else{
		var ccid = addCircleMF(me,accuracy,"#33000099");
		var mkid = addMarkerMF(me,Ti.App.Android.R.drawable.me_point_blue_1);
	    Ti.App.Properties.setInt("mySpot",mkid);
	    Ti.App.Properties.setInt("myCircle",ccid);
    	//Ti.API.info("creating my loc mk:"+mkid+",cc:"+ccid);
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
