var getAddressOSM = function(latitude,longitude, callback){
     Ti.Geolocation.reverseGeocoder(latitude,longitude,function(evt){
        //places = evt.places;
     if(callback) {
        Ti.API.info("reverse geolocation result = "+JSON.stringify(evt.places[0].address));
        callback.call(null, evt.places[0].address);
     }
  });
};
var getAddressCallback = function(e) {
    Ti.API.info("address callback = "+e);
    AllViews["place_name1"].text = e[0];
    AllViews["place_name2"].text = e[1];
};
//reverse geocoding google
function getAddressGoogle(lat,lng, callback){
	var addrUrl = "http://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng="+lat+","+lng;
	/* web-service call */
	var addrReq = Titanium.Network.createHTTPClient();
	addrReq.open("GET",addrUrl);
	addrReq.send(null);
	  
	addrReq.onload = function(){
    var response = JSON.parse(this.responseText);
    if(response.status == "OK"){
        var resLen = response.results[0].address_components.length;
        var number,street,area,city,state,country,zip;
        for(var i=0; i < resLen; i++) {
            switch (response.results[0].address_components[i].types[0]){
                case "street_number":
                    number=response.results[0].address_components[i].long_name;
                    Ti.API.info("street number : "+number);
                    break;
                case "route":
                	street = response.results[0].address_components[i].long_name;
                    Ti.API.info("street name : "+street);
                    break;
                case "sublocality_level_1":
                	area = response.results[0].address_components[i].long_name;
                    Ti.API.info("area name : "+area);
                    break;
                case "locality":
                	city = response.results[0].address_components[i].long_name;
                    Ti.API.info("city name : "+city);
                    break;
                case "administrative_area_level_1":
                	state = response.results[0].address_components[i].long_name;
                    Ti.API.info("state name : "+state);
                    break;
                case "postal_code":
                	zip = response.results[0].address_components[i].long_name;
                    Ti.API.info("zip code : "+zip);
                    break;
                case "country":
                	country = response.results[0].address_components[i].long_name;
                    Ti.API.info("country name : "+country);
                    break;
                }
	        }
	        if(typeof area ==='undefined') area='';
	        else area+=", ";
	        if(typeof number ==='undefined') number='';
	        else number+=" ";
	        var address = [number+street, area+city+" "+zip];	//state,country
	        if(callback) {
		       Ti.API.info("reverse geolocation result = "+address);
		       callback.call(null, address);
		    }
	    }else{
	        showAlert('','Unable to find Address');
	    }
	};
}
//forward geocoding google
function searchAddressGoogle(name,country_code){
	//region="+country_code+"&
	var url = "http://maps.google.com/maps/api/geocode/json?sensor=true&address="+name.replace(' ', '+')+','+country_code;
	var xhrGeocode = Ti.Network.createHTTPClient();
	xhrGeocode.setTimeout(120000);
	xhrGeocode.onerror = function (e) {
	  alert('Error occurred'+e);
	};
	 
	xhrGeocode.onload = function (e) {
	  var response = JSON.parse(this.responseText);
	  if (response.status == 'OK' && response.results != undefined && response.results.length > 0) {
	    myLat = response.results[0].geometry.location.lat;
	    myLon = response.results[0].geometry.location.lng;
	    //ShowMap();
	    Ti.API.info('['+myLat+','+myLon+']');
	  }
	};
	xhrGeocode.open("GET", url);
	xhrGeocode.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhrGeocode.send();
}
