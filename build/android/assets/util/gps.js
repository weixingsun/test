function handleLocation(e){if(!e.error){Ti.App.Properties.setDouble("lng",e.coords.longitude),Ti.App.Properties.setDouble("lat",e.coords.latitude),Ti.App.Properties.setInt("heading",e.coords.heading),Ti.App.Properties.setInt("accuracy",e.coords.accuracy),Ti.App.Properties.setInt("speed",e.coords.speed);var t=[e.coords.latitude,e.coords.longitude];addMyLocMarker(t,e.coords.accuracy);var i=getNodes(),r=Ti.App.Properties.getInt("MODE");if(i.length<1||0==r)return;var n,o;try{var a=2*e.coords.accuracy>GPS_RANGE?GPS_RANGE:2*e.coords.accuracy;o=findMyStep(t,a),n=findNextNode(o,t)}catch(p){Ti.API.info("handleLocation():"+i+", "+p.message)}if("undefined"!=typeof n){var s=n.pts[0],d=distance(t[0],t[1],s[1],s[0]);showToast(o,d)}}}function findNextNode(e,t){var i,r=getNodes(),n=JSON.parse(r),o=n[0].pts[0],a=distance(t[0],t[1],o[1],o[0]);if(0>e){if(GPS_RANGE>a)return n[0]}else e+1<n.length&&(i=n[e+1],Ti.API.info("nextPoint="+JSON.stringify(i.pts[0])));return i}function findMyStep(e,t){var i=JSON.stringify(e),r=getNodes(),n=JSON.parse(r),o=findMyStepId(i,n,t);return o}function findMyStepId(e,t,i){for(var r=-1,n=0;n<t.length;n++){var o=JSON.stringify(t[n].pts),a=checkStep(e,o,i);if(a){r=n;break}}return r}function showToast(e,t){var i="";i=e>-1?t+"m to step 0, in step "+e:t+"m to step 0, not in any step";var r=Titanium.UI.createNotification({duration:Ti.UI.NOTIFICATION_DURATION_SHORT,message:i});r.show()}function checkStep(e,t,i){var r=mf.isInStep({range:i,point:e,points:t});return r}function addMyLocMarker(e,t){if(0!==Ti.App.Properties.getInt("myCircle")||0!==Ti.App.Properties.getInt("mySpot"))map.updateLayer({id:Ti.App.Properties.getInt("myCircle"),type:"circle",latlng:e,radius:t,move:1}),map.updateLayer({id:Ti.App.Properties.getInt("mySpot"),type:"marker",latlng:e,move:1});else{var i=map.createCircle({latlng:e,colorHex:"#33000099",radius:t}),r=map.createMarker({iconPath:Ti.App.Android.R.drawable.me_point_blue_1,latlng:e});Ti.App.Properties.setInt("mySpot",r.id),Ti.App.Properties.setInt("myCircle",i.id)}}function addHandler(){locationAdded||(Ti.API.info("setup gps handler 2"),Ti.Geolocation.addEventListener("location",handleLocation),locationAdded=!0)}function removeHandler(){locationAdded&&(Ti.API.info("removeHandler gps"),Ti.Geolocation.removeEventListener("location",handleLocation),locationAdded=!1)}function initGPS(){Ti.Geolocation.accuracy=Ti.Geolocation.ACCURACY_BEST,Ti.Geolocation.distanceFilter=100,Ti.Geolocation.preferredProvider=Ti.Geolocation.PROVIDER_GPS,Ti.Geolocation.locationServicesEnabled?(Ti.API.info("setup gps handler 1"),addHandler()):alert("Please enable location services")}function distance(e,t,i,r){var n=6371,o=.5-Math.cos((i-e)*Math.PI/180)/2+Math.cos(e*Math.PI/180)*Math.cos(i*Math.PI/180)*(1-Math.cos((r-t)*Math.PI/180))/2,a=2*n*Math.asin(Math.sqrt(o))*1e3;return a.toFixed(0)}var locationAdded=!1,GPS_RANGE=50;