function Map(){this.win=Ti.UI.createWindow(),this.mapView=0,this.destination=[0,0],this.location=[0,0],this.mapmodule=0,this.mode=0,this.navimodule=0,this.nodeMarkerIds=[],this.nodes=0,this.dest_marker=0,this.polylineId=0,this.ROUTING=!1,this.searchBar,this.searchThread=0,this.searchList=0,this.GPS_RANGE_MIN=30,this.GPS_RANGE_MAX=200,this.by="car",this.BYS=["car","bike","foot"],this.BY_ICONS=[Ti.App.Android.R.drawable.sedan_128,Ti.App.Android.R.drawable.bicycle_128,Ti.App.Android.R.drawable.runner_128]}Map.prototype.changeToNextBy=function(){var e=this.BYS.indexOf(this.by),i=e==this.BYS.length-1?0:e+1;this.by=this.BYS[i];var t={by:this.by,icon:this.BY_ICONS[i]};return t},Map.prototype.initNav=function(){this.navimodule.load(Ti.App.id+"/gh/nz/")},Map.prototype.getCurrentPos=function(){return this.location},Map.prototype.getDestinatePos=function(){return this.destination},Map.prototype.getImageSize=function(e){var i=Ti.UI.createImageView({image:e,height:"auto",width:"auto"}),t={height:i.size.height,width:i.size.width};return Ti.API.info("height="+i.size.height),Ti.API.info("width="+i.size.width),i=null,t},Map.prototype.initGPS=function(){var e=this;Ti.Geolocation.Android.manualMode=!0;var i=Ti.Geolocation.Android.createLocationProvider({name:Ti.Geolocation.PROVIDER_GPS,minUpdateTime:"2"});Ti.Geolocation.Android.addLocationProvider(i);var t=Ti.Geolocation.Android.createLocationRule({provider:Ti.Geolocation.PROVIDER_GPS,maxAge:3e3,minAge:2e3});Ti.Geolocation.Android.addLocationRule(t);var o=Ti.Geolocation.Android.createLocationProvider({name:Ti.Geolocation.PROVIDER_NETWORK});Ti.Geolocation.Android.addLocationProvider(o);var a=Ti.Geolocation.Android.createLocationRule({provider:Ti.Geolocation.PROVIDER_NETWORK,accuracy:20,maxAge:3e3,minAge:2e3});Ti.Geolocation.Android.addLocationRule(a),Ti.Geolocation.locationServicesEnabled?(Ti.API.info("gps enabled"),Ti.Geolocation.addEventListener("location",function(i){if(!i.error){e.saveGpsData(i);var t=[i.coords.latitude,i.coords.longitude];if(1===map.type&&e.addMyLocMarker(t,i.coords.accuracy),e.nodes.length>0&&e.mode>0){e.animateTo(t);var o=e.checkOnRoad(i.coords.accuracy);if(o>-1){var a=e.findNextNode(e.nodes,o);e.hint(o,a)}else Ti.API.info("rerouting stepId="+o),e.reroute()}}})):alert("Please enable location services")},Map.prototype.reroute=function(){if(!this.ROUTING){this.removeAll();var e=this.getCurrentPos(),i=this.getDestinatePos();this.navi(e,i)}},Map.prototype.findNextNode=function(e,i){return i+1<e.length?e[i+1]:e[i]},Map.prototype.hint=function(e,i){var t=i.pts[0],o=distance(this.location[0],this.location[1],t[1],t[0]);this.instruction(e,i,o)},Map.prototype.instruction=function(e,i,t){var o="";if(e>-1){var a=100*Math.round(t/100),n=audio.GH_TURN_DICT[""+i.sign],r=!0;audio.isPlayed(e,a)||(Ti.API.info("dist="+a+",stepId="+e+" turn="+n+", nextNode:"+JSON.stringify(i)),r=audio.speakInterface(a,n,i.name),r&&audio.setPlayedList(e,a)),o="step "+e+", "+a+"m("+t+"), turn "+n+", on "+i.name+", play="+r}else o=t>0?"dist="+t+",but not in any step":"not in any step";Titanium.UI.createNotification({duration:Ti.UI.NOTIFICATION_DURATION_SHORT,message:o}).show()},Map.prototype.checkOnRoad=function(e){var i=this.getRange(e),t=this.findMyStepId(this.nodes,this.location,i);return 0>t&&(t=this.findMyStepId(this.nodes,this.location,i+50)),t},Map.prototype.findMyStepId=function(e,i,t){for(var o=-1,a=0;a<e.length;a++){var n=this.checkStep(JSON.stringify(i),JSON.stringify(e[a].pts),t);if(n){o=a;break}}return o},Map.prototype.checkStep=function(e,i,t){return this.navimodule.isInStep({range:t,point:e,points:i})},Map.prototype.getRange=function(e){return e<this.GPS_RANGE_MIN?this.GPS_RANGE_MIN:e},Map.prototype.saveGpsData=function(e){Ti.App.Properties.setDouble("gps_lng",e.coords.longitude),Ti.App.Properties.setDouble("gps_lat",e.coords.latitude),this.location=[e.coords.latitude,e.coords.longitude],Ti.App.Properties.setInt("heading",e.coords.heading),Ti.App.Properties.setInt("gps_accuracy",e.coords.accuracy),Ti.App.Properties.setInt("speed",e.coords.speed)},Map.prototype.removeAll=function(e){if(0!==this.polyLineId&&this.removePolyline(this.polyLineId),!(this.nodeMarkerIds.length<1))for(var i=0;i<this.nodeMarkerIds.length;i++)this.removeMarker(this.nodeMarkerIds[i])},Map.prototype.navi=function(e,i){var t=this;t.ROUTING=!0;var o={vehicle:this.by,from:e,to:i};Ti.API.info("navi from:"+e+" to:"+i+",by"+this.by),this.navimodule.getRouteAsyncCallback(o,function(e){0==e.error?t.drawGHonMap(e):Ti.API.info("navi error:"+e.errmsg),t.ROUTING=!1})},Map.prototype.drawGHonMap=function(e){this.removeAll();var i=this.addPolyline(e.pts,"blue",10);this.polyLineId=i,this.nodes=e.nodes,this.addNodeMarkers(),this.mode=1,this.win.setKeepScreenOn(!0),audio.played={}},Map.prototype.addNodeMarkers=function(){for(var e=[],i=0;i<this.nodes.length;i++){var t=this.nodes[i].pts[0],o=[t[1],t[0]],a=Ti.App.Android.R.drawable.point_red,n=this.addMarker(o,a);e.push(n)}this.nodeMarkerIds=e};