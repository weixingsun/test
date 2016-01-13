function Map(){
	this.win = Ti.UI.createWindow();
    this.mapView = 0;
    this.type=0;	//0->gmap  1->osm
	this.destination=[0,0];
	this.location=[0,0];
	this.mode=0;
	this.mapmodule=0;
	this.navimodule=0;
	this.nodeMarkerIds=[];
	this.nodes=0;
	this.dest_marker=0;
	this.polylineId=0;
	this.ROUTING=false;
	this.searchBar;
	this.searchThread=0;
	this.searchList=0;
	this.GPS_RANGE_MIN = 30;
	this.GPS_RANGE_MAX = 200;
	this.by='car';
	this.BYS = ["car","bike","foot"];
	this.BY_ICONS = [Ti.App.Android.R.drawable.sedan_128,Ti.App.Android.R.drawable.bicycle_128,Ti.App.Android.R.drawable.runner_128];
};
Map.prototype.changeToNextBy=function(){
	var index = this.BYS.indexOf(this.by);
	var nextindex = index==this.BYS.length-1?0:index+1;
	this.by=this.BYS[nextindex];
	var nextby = {by:this.by,icon:this.BY_ICONS[nextindex]};
	return nextby;
};
Map.prototype.initNav=function(){
	this.navimodule.load(Ti.App.id+"/gh/nz/");
};
Map.prototype.getCurrentPos=function(){
	return this.location;
};
Map.prototype.getDestinatePos=function(){
	return this.destination;
};
Map.prototype.getImageSize = function (imgID){
	var imageTemp = Ti.UI.createImageView({
	  image : imgID,
	  height:'auto',
	  width:'auto'
	});
	var size = {
		height:imageTemp.size.height,
		width:imageTemp.size.width,
		};
	Ti.API.info( "height=" + imageTemp.size.height);
	Ti.API.info( "width=" + imageTemp.size.width);
	imageTemp = null;
	return size;
};
Map.prototype.initGPS=function(){
		var that = this;
		//Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
		//Ti.Geolocation.distanceFilter = 10; //drop event accuracy > 10m
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
	    	Ti.Geolocation.addEventListener('location',function(e) {
			    if (!e.error) {
			        that.saveGpsData(e);
				    var me = [e.coords.latitude,e.coords.longitude];
					var cctv = places.searchOfflineCctv(me);
				    if(map.type===1)
				    	that.addMyLocMarker(me,e.coords.accuracy);
				    if(that.nodes.length>0 && that.mode>0){
				    	that.animateTo(me);
				    	var stepId = that.checkOnRoad(e.coords.accuracy);
						if(stepId>-1){
							var nextNode = that.findNextNode(that.nodes,stepId);
							that.hint(stepId,nextNode);
						}else{
							Ti.API.info('rerouting stepId='+stepId);
							that.reroute();
						}
				    }
			    }
			});
		    //var activity = Ti.Android.currentActivity;
		    //activity.addEventListener('destroy', removeHandler);
		    //activity.addEventListener('pause', removeHandler);
		    //activity.addEventListener('resume', addHandler);
		} else {
		    alert('Please enable location services');
		}
	};
Map.prototype.reroute=function(){
	/*var toast = Titanium.UI.createNotification({
		duration: Ti.UI.NOTIFICATION_DURATION_SHORT,
		message: 'redraw route?range='+range+',accuracy='+e.coords.accuracy,
	});
	toast.show();*/
	if(!this.ROUTING){
		//play replaning route mp3
		this.removeAll();
		var from = this.getCurrentPos();
    	var to = this.getDestinatePos();
    	this.navi(from,to);
	}
};
Map.prototype.findNextNode = function (nodes,currId){
	if(currId+1<nodes.length){
		return nodes[currId+1];
	}else{//last node
		return nodes[currId];
	}
};
Map.prototype.hint = function (stepId,nextNode){
	var nextPoint = nextNode.pts[0];
    var dist2next = distance(this.location[0],this.location[1],nextPoint[1],nextPoint[0]);
    this.instruction(stepId,nextNode,dist2next);
};
Map.prototype.instruction = function(stepId,nextNode,dist){
	var msg = '';
	if(stepId>-1){
		var dist00 = Math.round(dist/100)*100;//ceil/floor/round
		var turn = audio.GH_TURN_DICT[''+nextNode.sign];
		var playOrNot = true;
    	if(!audio.isPlayed(stepId,dist00)){
			Ti.API.info('dist='+dist00+",stepId="+stepId+" turn="+turn+", nextNode:"+JSON.stringify(nextNode));
			//playOrNot = speakMp3(turn,dist00);
			playOrNot = audio.speakInterface(dist00,turn,nextNode.name);
			if(playOrNot) audio.setPlayedList(stepId,dist00);
		}
		msg='step '+ stepId+', '+dist00+'m('+dist+'), turn ' +turn+', on '+nextNode.name +', play='+playOrNot;
	}else if(dist>0){
		msg='dist='+dist+',but not in any step';
	}else{
		msg='not in any step';
	}
	Titanium.UI.createNotification({
		duration: Ti.UI.NOTIFICATION_DURATION_SHORT,
		message: msg
	}).show();
};

Map.prototype.checkOnRoad = function (accuracy){
	var range = this.getRange(accuracy);
	var stepId = this.findMyStepId(this.nodes, this.location, range);
	if(stepId<0){
		stepId = this.findMyStepId(this.nodes, this.location, range+50);
	}
	return stepId;
	//var nextNode = findNextNode(nodes,stepId);
};
Map.prototype.findMyStepId = function (nodes, me, range){
	var inWhichStep = -1;
	for (var i = 0; i < nodes.length; i++){
      var isIn = this.checkStep(JSON.stringify(me), JSON.stringify(nodes[i].pts), range);
      if(isIn) {
      	inWhichStep=i;
      	break;
      }
    }
    return inWhichStep;
};
Map.prototype.checkStep = function (me,nodePts,range){
	return this.navimodule.isInStep({
		"range": range,
		"point": me,
		"points": nodePts //in meter
	});
};
Map.prototype.getRange = function (accuracy){
	return (accuracy < this.GPS_RANGE_MIN) ? this.GPS_RANGE_MIN : accuracy;
};
Map.prototype.saveGpsData=function (e){
	Ti.App.Properties.setDouble("gps_lng",e.coords.longitude);
	Ti.App.Properties.setDouble("gps_lat",e.coords.latitude);
	this.location=[e.coords.latitude,e.coords.longitude];
	Ti.App.Properties.setInt("heading",e.coords.heading);
	Ti.App.Properties.setInt("gps_accuracy",e.coords.accuracy);
	Ti.App.Properties.setInt("speed",e.coords.speed);
	//e.coords.altitude/e.coords.timestamp/e.coords.altitudeAccuracy
};

Map.prototype.removeAll=function (data){
	if(this.polyLineId!==0)
		this.removePolyline(this.polyLineId);
	if(this.nodeMarkerIds.length<1) return;
	for (var i = 0; i < this.nodeMarkerIds.length; i++){
		this.removeMarker(this.nodeMarkerIds[i]);
	}
};
Map.prototype.navi=function (from,to){
	var that = this;
	that.ROUTING=true;
	var args = {
		"vehicle":   this.by,		//car/foot/bicycle/bus
		"from": from,
		"to":   to
	};
	Ti.API.info("navi from:"+from+" to:"+to+",by"+this.by);
	//weighting:fastest,	//fast/short
	this.navimodule.getRouteAsyncCallback(args,function(data){
		if(data.error==0){
			that.drawGHonMap(data);
		}else{
			Ti.API.info("navi error:"+data.errmsg);
		}
		that.ROUTING=false;
	});
};
Map.prototype.drawGHonMap=function (data){
	this.removeAll();
	var lineid = this.addPolyline(data.pts,"blue",10);
	this.polyLineId=lineid;
	this.nodes=data.nodes;
	this.addNodeMarkers();
	this.mode=1;
	this.win.setKeepScreenOn(true);
	audio.played={};
};
Map.prototype.addNodeMarkers=function(){
	var tempMarkerIds = [];
	for (var i = 0; i < this.nodes.length; i++){
	    var p = this.nodes[i].pts[0];
	    var pp = [p[1],p[0]];
	    var id=Ti.App.Android.R.drawable.point_red;
	    var mkid=this.addMarker(pp,id);
	    //var name = 'RouteMarker_'+p[1]+'_'+p[0];
	    //if(isGoogleMap()) nodeMarkerIds.push(name);
		tempMarkerIds.push(mkid);
	}
	this.nodeMarkerIds=tempMarkerIds;
};

