var getLongpressAddress=function(e,i,t){Titanium.Geolocation.reverseGeocoder(e,i,function(e){Ti.API.info("reverse geolocation result = "+JSON.stringify(e)),t&&t.call(null,e)})},getLongpressAddressCallback=function(e){Ti.API.info("geolocation callback = "+JSON.stringify(e)),AllViews.place_name.text=e.places.address};