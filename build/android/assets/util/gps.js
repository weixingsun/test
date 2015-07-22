function findNextNode(e,i){return i+1<e.length?e[i+1]:e[i]}function findMyStepId(e,i,t){for(var n=JSON.stringify(i),o=-1,a=0;a<e.length;a++){var r=JSON.stringify(e[a].pts),d=checkStep(n,r,t);if(d){o=a;break}}return o}function showToast(e,i,t){var n="";if(e>-1){var o=Ti.App.Properties.getString("GH_TURN_DICT"),a=JSON.parse(o),r=a[""+i.sign];n="in "+t+"m, turn "+r+", on "+i.name+", in step "+e}else n=t>0?"dist="+t+",but not in any step":"not in any step";var d=Titanium.UI.createNotification({duration:Ti.UI.NOTIFICATION_DURATION_SHORT,message:n});d.show()}function checkStep(e,i,t){var n=mf.isInStep({range:t,point:e,points:i});return n}function addMyLocMarker(e,i){if(0!==Ti.App.Properties.getInt("myCircle")||0!==Ti.App.Properties.getInt("mySpot"))map.updateLayer({id:Ti.App.Properties.getInt("myCircle"),type:"circle",latlng:e,radius:i,move:1}),map.updateLayer({id:Ti.App.Properties.getInt("mySpot"),type:"marker",latlng:e,move:1});else{var t=map.createCircle({latlng:e,colorHex:"#33000099",radius:i}),n=map.createMarker({iconPath:Ti.App.Android.R.drawable.me_point_blue_1,latlng:e});Ti.App.Properties.setInt("mySpot",n.id),Ti.App.Properties.setInt("myCircle",t.id)}}function removeHandler(){Ti.API.info("removeHandler gps"),Ti.Geolocation.Android.removeEventListener("location",locationCallback)}function initGPS(){Ti.Geolocation.Android.manualMode=!0;var e=Ti.Geolocation.Android.createLocationProvider({name:Ti.Geolocation.PROVIDER_GPS,minUpdateTime:2,minUpdateDistance:50});Ti.Geolocation.Android.addLocationProvider(e);var i=Ti.Geolocation.Android.createLocationRule({provider:Ti.Geolocation.PROVIDER_GPS,accuracy:50,maxAge:3e4,minAge:2e3});Ti.Geolocation.Android.addLocationRule(i);var t=Ti.Geolocation.Android.createLocationProvider({name:Ti.Geolocation.PROVIDER_NETWORK});Ti.Geolocation.Android.addLocationProvider(t);var n=Ti.Geolocation.Android.createLocationRule({provider:Ti.Geolocation.PROVIDER_NETWORK,accuracy:50,maxAge:3e4,minAge:2e3});Ti.Geolocation.Android.addLocationRule(n),Ti.Geolocation.locationServicesEnabled?(Ti.API.info("gps enabled"),Ti.Geolocation.addEventListener("location",locationCallback)):alert("Please enable location services")}function distance(e,i,t,n){var o=6371,a=.5-Math.cos((t-e)*Math.PI/180)/2+Math.cos(e*Math.PI/180)*Math.cos(t*Math.PI/180)*(1-Math.cos((n-i)*Math.PI/180))/2,r=2*o*Math.asin(Math.sqrt(a))*1e3;return r.toFixed(0)}var locationAdded=!1,GPS_RANGE_MIN=60,GPS_RANGE_MAX=200,locationCallback=function(e){if(!e.error){Ti.App.Properties.setDouble("gps_lng",e.coords.longitude),Ti.App.Properties.setDouble("gps_lat",e.coords.latitude),Ti.App.Properties.setInt("heading",e.coords.heading),Ti.App.Properties.setInt("speed",e.coords.speed);var i=[e.coords.latitude,e.coords.longitude];addMyLocMarker(i,e.coords.accuracy);var t=getNodes();Ti.API.info("handleLocation()done with location, start deal with route");var n=Ti.App.Properties.getInt("MODE");if(t.length<1||0==n)return;map.centerLatlng=i;var o,a,t=getNodes(),r=JSON.parse(t);try{var d=e.coords.accuracy<GPS_RANGE_MIN?GPS_RANGE_MIN:e.coords.accuracy;a=findMyStepId(r,i,d),o=findNextNode(r,a)}catch(c){Ti.API.info("handleLocation()err:"+c.message+", "+t)}if("undefined"!=typeof o){var s=o.pts[0],p=distance(i[0],i[1],s[1],s[0]);showToast(a,o,p)}else{var l=Titanium.UI.createNotification({duration:Ti.UI.NOTIFICATION_DURATION_SHORT,message:"redraw route?"});l.show()}}};