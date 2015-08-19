function getAddressGoogle(e,i,t){var a="https://maps.googleapis.com/maps/api/geocode/json?sensor=true&latlng="+e+","+i+"&key="+GOOGLE_API_KEY,n=Titanium.Network.createHTTPClient();n.open("GET",a),n.send(null),n.onload=function(){var e=JSON.parse(this.responseText);if("OK"==e.status){var i=getInfoFromGoogleJsonSimple(e.results[0].address_components);t&&t.call(null,i)}else Ti.API.error("getAddressGoogle:"+this.responseText)}}function getInfoFromGoogleJson(e){for(var i,t,a,n,o,r,s,l=0;l<e.length;l++)switch(e[l].types[0]){case"street_number":i=e[l].short_name,Ti.API.info("street number : "+i);break;case"route":t=e[l].long_name,Ti.API.info("street name : "+t);break;case"sublocality_level_1":a=e[l].long_name,Ti.API.info("area name : "+a);break;case"locality":n=e[l].long_name,Ti.API.info("city name : "+n);break;case"administrative_area_level_1":o=e[l].long_name,Ti.API.info("state name : "+o);break;case"postal_code":r=e[l].long_name,Ti.API.info("zip code : "+r);break;case"country":s=e[l].long_name,Ti.API.info("country name : "+s)}return"undefined"==typeof a?a="":a+=", ","undefined"==typeof i?i="":i+=" ",{number:i,street:t,area:a,city:n,state:o,zip:r,country:s}}function getInfoFromGoogleJsonSimple(e){for(var i=[],t=[],a=["administrative_area_level_2","administrative_area_level_1","postal_code","country"],n=0;n<e.length;n++){var o=a.indexOf(e[n].types[0])>-1;o?t.push(e[n].short_name):i.push(e[n].short_name)}return[i.join(", "),t.join()]}function searchAddressGoogle(e,i){var t="https://maps.google.com/maps/api/geocode/json?sensor=true&address="+e.replace(" ","+")+","+i+"&key="+GOOGLE_API_KEY,a=Ti.Network.createHTTPClient();a.setTimeout(1e4),a.onerror=function(e){Ti.API.error("searchAddressGoogle()Error:"+e)},a.onload=function(){var e=JSON.parse(this.responseText);if("OK"==e.status&&void 0!=e.results&&e.results.length>0){for(var i=[],t=0;t<e.results.length;t++){var a={addr:"",point:""},n=e.results[t].geometry.location.lat,o=e.results[t].geometry.location.lng,r=getInfoFromGoogleJsonSimple(e.results[t].address_components);a.addr=r[0],a.point=JSON.stringify([n,o]),i.push(a)}createSuggestList(i)}else Ti.API.error("searchAddressGoogle()ServerError:"+this.responseText)},a.open("GET",t),a.setRequestHeader("Content-Type","application/json; charset=utf-8"),a.send()}var getAddressOSM=function(e,i,t){Ti.Geolocation.reverseGeocoder(e,i,function(e){t&&(Ti.API.info("reverse geolocation result = "+JSON.stringify(e.places[0].address)),t.call(null,e.places[0].address))})},getAddressCallback=function(e){AllViews.place_name1.text=e[0],AllViews.place_name2.text=e[1]};