function reverseGEO(e,i){Ti.Geolocation.reverseGeocoder(e,i,function(e){if(e.success){var i=e.places;if(i&&i.length){i[0].address}else alert("No address found");Ti.API.info("reverse geolocation result = "+JSON.stringify(e))}})}var longitude,latitude,heading,accuracy,speed;Ti.Geolocation.accuracy=Ti.Geolocation.ACCURACY_BEST,Ti.Geolocation.distanceFilter=10,Ti.Geolocation.getCurrentPosition(function(e){if(!e.success||e.error)return void alert("error "+JSON.stringify(e.error));longitude=e.coords.longitude,latitude=e.coords.latitude,heading=e.coords.heading,accuracy=e.coords.accuracy,speed=e.coords.speed;e.coords.altitude,e.coords.timestamp,e.coords.altitudeAccuracy});var locationCallback=function(e){if(e.success&&!e.error){{var i=e.coords.longitude,r=e.coords.latitude;e.coords.altitude,e.coords.heading,e.coords.accuracy,e.coords.speed,e.coords.timestamp,e.coords.altitudeAccuracy}setTimeout(function(){},100),reverseGEO(r,i)}};Ti.Geolocation.addEventListener("location",locationCallback);