function findSavedMarker(e){for(var a=map.getZoomLevel(),i=JSON.parse(Ti.App.Properties.getString("SavedPlaceMarkers")),t=0;t<i.length;t++){var r=i[t].latlng,n=distance(r[0],r[1],e[0],e[1]),o=tapRange(a,n);if(o)return i[t]}return null}function tapRange(e,a){var i=!1;switch(e){case 20:i=3>a?!0:!1;break;case 19:i=5>a?!0:!1;break;case 18:i=10>a?!0:!1;break;case 17:i=20>a?!0:!1;break;case 16:i=30>a?!0:!1;break;case 15:i=50>a?!0:!1;break;case 14:i=150>a?!0:!1;break;case 13:i=300>a?!0:!1;break;case 12:i=500>a?!0:!1;break;case 11:i=1e3>a?!0:!1;break;case 10:i=2e3>a?!0:!1;break;case 10:i=4e3>a?!0:!1;break;case 9:i=6e3>a?!0:!1;break;case 8:i=1e4>a?!0:!1;break;case 7:i=2e4>a?!0:!1;break;case 6:i=3e4>a?!0:!1;break;case 5:i=4e4>a?!0:!1;break;case 4:i=5e4>a?!0:!1}return i}function createSavedPlaceTable(){var e=Ti.Database.open("wx_map");e.execute("CREATE TABLE IF NOT EXISTS saved_places(lat varchar(20), lng varchar(20), name varchar(100));"),e.close()}function showAllSavedPlaceMarkers(){for(var e=selectAllPlacesDB(),a=[],i=0;i<e.length;i++){var t=[e[i].lat,e[i].lng],r=Ti.App.Android.R.drawable.star_red_24,n=addMarker(map,t,r),o={mk:n,latlng:t};a.push(o)}var l=JSON.stringify(a);Ti.App.Properties.setString("SavedPlaceMarkers",l),Ti.API.info("SavedPlaceMarkers="+l)}function compare(e,a){var i=Number(e.toString().split(",")[0]),t=Number(e.toString().split(",")[1]),r=Number(a.toString().split(",")[0]),n=Number(a.toString().split(",")[1]);return i.toFixed(6)==r.toFixed(6)&&t.toFixed(6)==n.toFixed(6)?(Ti.API.info(i+","+t+" = "+r+","+n),!0):(Ti.API.info(i+","+t+" != "+r+","+n),!1)}function removeSavedPlaceMarker(e){for(var a=Ti.App.Properties.getString("SavedPlaceMarkers"),i=JSON.parse(a),t=0;t<i.length;t++){var r=i[t].latlng,n=i[t].mk;compare(r,e)&&(removeLayer(n),i.removeAt(t))}var a=JSON.stringify(i);Ti.API.info("removeSavedPlaceMarker="+a),Ti.App.Properties.setString("SavedPlaceMarkers",a)}function addSavedPlaceMarker(e){var a=Ti.App.Properties.getString("SavedPlaceMarkers"),i=JSON.parse(a),t=Ti.App.Android.R.drawable.star_red_24,r=addMarker(map,e,t),n={mk:r,latlng:e};i.push(n);var a=JSON.stringify(i);Ti.API.info("SavedPlaceMarkers="+a),Ti.App.Properties.setString("SavedPlaceMarkers",a)}function selectAllPlacesDB(){var e,a,i=[];try{for(e=Ti.Database.open("wx_map"),a=e.execute("select * from saved_places;");a.isValidRow();)i.push({lat:a.fieldByName("lat"),lng:a.fieldByName("lng"),name:a.fieldByName("name")}),a.next();Ti.API.info("selectAllPlacesDB()row#"+a.rowCount)}finally{null!==a&&a.close(),null!==e&&e.close()}return i}function selectASavedPlace(e){var a,i=[];try{a=Ti.Database.open("wx_map");var t=JSON.parse(e),r=a.execute("select * from saved_places where lat=? and lng=? ",t);if(r.rowCount<1)return null;for(;r.isValidRow();)i.push({lat:r.fieldByName("lat"),lng:r.fieldByName("lng"),name:r.fieldByName("name")}),r.next()}finally{null!==r&&r.close(),null!==a&&a.close()}return i[0]}function isSavedPlacesDB(e){var a=!1,i=selectASavedPlace(e);return null!==i&&(a=!0),a}function addSavedPlaceDB(e){var a;try{a=Ti.Database.open("wx_map");var i=[e.lat,e.lng,e.name];a.execute("insert into saved_places(lat,lng,name) values(?,?,?)",i)}finally{null!==a&&a.close()}Ti.API.info("addSavedPlaceDB():"+JSON.stringify(e))}function removeSavedPlaceDB(e){var a;try{a=Ti.Database.open("wx_map");var i=[e.lat,e.lng];a.execute("delete from saved_places where lat=? and lng=?",i)}finally{null!==a&&a.close()}Ti.API.info("removeSavedPlaceDB():"+JSON.stringify(e))}function updateSavedPlaceDB(e){var a;try{a=Ti.Database.open("wx_map");var i=[e.lat,e.lng];a.execute("delete from saved_places where lat=? and lng=?",i)}finally{null!==a&&a.close()}Ti.API.info("removeSavedPlaceDB():"+JSON.stringify(e))}