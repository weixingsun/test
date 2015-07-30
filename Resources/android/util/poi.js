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
        //var addr = getInfoFromGoogleJson(response.results[0].address_components);
        //var address = [addr['number']+addr['street'], addr['area']+addr['city']+" "+addr['zip']];	//state,country
        var address = getInfoFromGoogleJsonSimple(response.results[0].address_components);
        if(callback) {
	       Ti.API.info("reverse geolocation result = "+address);
	       callback.call(null, address);
	    }
    }else{
        showAlert('','Unable to find Address');
    }
	};
}
function getInfoFromGoogleJson(value){
    //Ti.API.info("value : "+JSON.stringify(value));
	var number,street,area,city,state,zip,country;
	for(var i=0; i < value.length; i++) {
		switch (value[i].types[0]){
        case "street_number":
            number=value[i].short_name;	//long_name;
            Ti.API.info("street number : "+number);
            break;
        case "route":
        	street = value[i].long_name;
            Ti.API.info("street name : "+street);
            break;
        case "sublocality_level_1":
        	area = value[i].long_name;
            Ti.API.info("area name : "+area);
            break;
        case "locality":
        	city = value[i].long_name;
            Ti.API.info("city name : "+city);
            break;
        case "administrative_area_level_1":
        	state = value[i].long_name;
            Ti.API.info("state name : "+state);
            break;
        case "postal_code":
        	zip = value[i].long_name;
            Ti.API.info("zip code : "+zip);
            break;
        case "country":
        	country = value[i].long_name;
            Ti.API.info("country name : "+country);
            break;
    	}
    }
    if(typeof area ==='undefined') area='';
    else area+=", ";
    if(typeof number ==='undefined') number='';
    else number+=" ";
    return {"number":number,"street":street,"area":area,"city":city,"state":state,"zip":zip,"country":country};
}
function getInfoFromGoogleJsonSimple(value){
    //Ti.API.info("value : "+JSON.stringify(value));
    var line1 = [];
    var line2 = [];
    var line2Array = ["administrative_area_level_2","administrative_area_level_1", "postal_code","country"];//"locality"=city
	for(var i=0; i < value.length; i++) {
		var contains = (line2Array.indexOf(value[i].types[0]) > -1);
		if(contains){
			line2.push(value[i].short_name);
		}else{
			line1.push(value[i].short_name);
		}
    }
    return [line1.join(', '),line2.join()];
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
	  	var list=[];
	  	for(var i=0;i<response.results.length;i++){
	  		var dict = {'addr':'','point':''};
		    var myLat = response.results[i].geometry.location.lat;
		    var myLon = response.results[i].geometry.location.lng;
		    var addr = getInfoFromGoogleJsonSimple(response.results[i].address_components);
        	//var address = addr['number']+addr['street']+", "+addr['area']+addr['city']+" "+addr['zip'];	//state,country
        	dict.addr=addr[0];
        	dict.point=JSON.stringify([myLat,myLon]);
	  		list.push(dict);	//+','+addr[1]
	  	}
	  	createSuggestList(list);
	  }
	};
	xhrGeocode.open("GET", url);
	xhrGeocode.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhrGeocode.send();
}
function fillSuggestList(list){
	
}
