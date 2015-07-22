var getLongpressAddress = function(latitude,longitude, callback){
    Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt){
            //places = evt.places;
            Ti.API.info("reverse geolocation result = "+JSON.stringify(evt));
        if(callback) {
            callback.call(null, evt);
        }
  });
};
var getLongpressAddressCallback = function(e) {
    Ti.API.info("geolocation callback = "+JSON.stringify(e));
    AllViews["place_name"].text = e.places.address;
};