//Ti.include('net.js');
function Net(){
	//this.searchBar=0;
	//this.popView=0;

	this.GOOGLE_API_KEY = 'AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A';
};
Net.prototype.getPointAddressGoogle=function(point,callback){
	var that = this;
	var lat=point[0], lng=point[1];
	var addrUrl = "https://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng="+lat+","+lng+'&key='+this.GOOGLE_API_KEY;
	var addrReq = Titanium.Network.createHTTPClient();
	addrReq.open("GET",addrUrl);
	addrReq.send(null);

	addrReq.onload = function(){
	    var response = JSON.parse(this.responseText);
	    if(response.status == "OK"){
	        //var addr = getInfoFromGoogleJson(response.results[0].address_components);
	        //var address = [addr['number']+addr['street'], addr['area']+addr['city']+" "+addr['zip']];	//state,country
	        var address = that.getInfoFromGoogleJsonSimple(response.results[0].address_components);
	        if(callback) {
		       //Ti.API.info("reverse geolocation result = "+address);
		       callback.call(null, address);
		    }
	    }else{
	        Ti.API.error('getPointAddressGoogle:'+this.responseText);
	    }
	};
};
Net.prototype.getInfoFromGoogleJsonSimple=function (value){
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
};
//getAddressOSM(coord[0],coord[1], getAddressCallback);
Net.prototype.searchNameAddressGoogle = function(name,country){
	var that = this;
	//region="+country_code+"&
	var url = "https://maps.google.com/maps/api/geocode/json?sensor=true&address="+name.replace(' ', '+')+','+country+'&key='+this.GOOGLE_API_KEY;
	var xhrGeocode = Ti.Network.createHTTPClient();
	xhrGeocode.setTimeout(10000);
	xhrGeocode.onerror = function (e) {
	  Ti.API.error('Net.searchNameAddressGoogle()Error:'+e);
	};
	
	xhrGeocode.onload = function (e) {
	  var response = JSON.parse(this.responseText);
	  if (response.status == 'OK' && response.results != undefined && response.results.length > 0) {
	  	var list=[];
	  	for(var i=0;i<response.results.length;i++){
	  		var dict = {'addr':'','point':''};
		    var myLat = response.results[i].geometry.location.lat;
		    var myLon = response.results[i].geometry.location.lng;
		    var addr = that.getInfoFromGoogleJsonSimple(response.results[i].address_components);
        	//var address = addr['number']+addr['street']+", "+addr['area']+addr['city']+" "+addr['zip'];	//state,country
        	dict.addr=addr[0];
        	//dict.point=JSON.stringify([myLat,myLon]);
        	dict.point=[myLat,myLon];
	  		list.push(dict);	//+','+addr[1]
	  	}
	  	views.fillSearchList(list,"Online");
	  }else{
	  	Ti.API.error('Net.searchNameAddressGoogle()ServerError:'+this.responseText);
	  }
	};
	xhrGeocode.open("GET", url);
	xhrGeocode.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	xhrGeocode.send();
};