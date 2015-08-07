function findSavedMarker(e){for(var a=map.getZoomLevel(),t=JSON.parse(Ti.App.Properties.getString("SavedPlaceMarkers")),i=0;i<t.length;i++){var r=t[i].latlng,n=distance(r[0],r[1],e[0],e[1]),o=tapRange(a,n);if(o)return t[i]}return null}function tapRange(e,a){var t=!1;switch(e){case 20:t=3>a?!0:!1;break;case 19:t=5>a?!0:!1;break;case 18:t=10>a?!0:!1;break;case 17:t=20>a?!0:!1;break;case 16:t=30>a?!0:!1;break;case 15:t=50>a?!0:!1;break;case 14:t=150>a?!0:!1;break;case 13:t=300>a?!0:!1;break;case 12:t=500>a?!0:!1;break;case 11:t=1e3>a?!0:!1;break;case 10:t=2e3>a?!0:!1;break;case 10:t=4e3>a?!0:!1;break;case 9:t=6e3>a?!0:!1;break;case 8:t=1e4>a?!0:!1;break;case 7:t=2e4>a?!0:!1;break;case 6:t=3e4>a?!0:!1;break;case 5:t=4e4>a?!0:!1;break;case 4:t=5e4>a?!0:!1}return t}function createSavedPlaceTable(){var e=Ti.Database.open("wx_map");e.execute("CREATE TABLE IF NOT EXISTS saved_places(lat varchar(20), lng varchar(20), name varchar(100));"),e.close()}function showAllSavedPlaceMarkers(){for(var e=selectAllPlacesDB(),a=[],t=0;t<e.length;t++){var i=[e[t].lat,e[t].lng],r=Ti.App.Android.R.drawable.star_red_24,n=addMarker(map,i,r),o={mk:n,latlng:i};a.push(o)}var l=JSON.stringify(a);Ti.App.Properties.setString("SavedPlaceMarkers",l),Ti.API.info("SavedPlaceMarkers="+l)}function compare(e,a){var t=Number(e.toString().split(",")[0]),i=Number(e.toString().split(",")[1]),r=Number(a.toString().split(",")[0]),n=Number(a.toString().split(",")[1]);return t.toFixed(6)==r.toFixed(6)&&i.toFixed(6)==n.toFixed(6)?!0:!1}function removeSavedPlaceMarker(e){for(var a=Ti.App.Properties.getString("SavedPlaceMarkers"),t=JSON.parse(a),i=0;i<t.length;i++){var r=t[i].latlng,n=t[i].mk;compare(r,e)&&(removeLayer(n),t.removeAt(i))}var a=JSON.stringify(t);Ti.API.info("removeSavedPlaceMarker="+a),Ti.App.Properties.setString("SavedPlaceMarkers",a)}function addSavedPlaceMarker(e){var a=Ti.App.Properties.getString("SavedPlaceMarkers"),t=JSON.parse(a),i=Ti.App.Android.R.drawable.star_red_24,r=addMarker(map,e,i),n={mk:r,latlng:e};t.push(n);var a=JSON.stringify(t);Ti.API.info("SavedPlaceMarkers="+a),Ti.App.Properties.setString("SavedPlaceMarkers",a)}function selectAllPlacesDB(){var e,a,t=[];try{for(e=Ti.Database.open("wx_map"),a=e.execute("select * from saved_places;");a.isValidRow();)t.push({lat:a.fieldByName("lat"),lng:a.fieldByName("lng"),name:a.fieldByName("name")}),a.next();Ti.API.info("selectAllPlacesDB()row#"+a.rowCount)}finally{null!==a&&a.close(),null!==e&&e.close()}return t}function selectASavedPlace(e){var a,t=[];try{a=Ti.Database.open("wx_map");var i=JSON.parse(e),r=a.execute("select * from saved_places where lat=? and lng=? ",i);if(r.rowCount<1)return null;for(;r.isValidRow();)t.push({lat:r.fieldByName("lat"),lng:r.fieldByName("lng"),name:r.fieldByName("name")}),r.next()}finally{null!==r&&r.close(),null!==a&&a.close()}return t[0]}function isSavedPlacesDB(e){var a=!1,t=selectASavedPlace(e);return null!==t&&(a=!0),a}function addSavedPlaceDB(e){var a;try{a=Ti.Database.open("wx_map");var t=[e.lat,e.lng,e.name];a.execute("insert into saved_places(lat,lng,name) values(?,?,?)",t)}finally{null!==a&&a.close()}Ti.API.info("addSavedPlaceDB():"+JSON.stringify(e))}function removeSavedPlaceDB(e){var a;try{a=Ti.Database.open("wx_map");var t=[e.lat,e.lng];a.execute("delete from saved_places where lat=? and lng=?",t)}finally{null!==a&&a.close()}Ti.API.info("removeSavedPlaceDB():"+JSON.stringify(e))}function updateSavedPlaceDB(e){var a;try{a=Ti.Database.open("wx_map");var t=[e.lat,e.lng];a.execute("delete from saved_places where lat=? and lng=?",t)}finally{null!==a&&a.close()}Ti.API.info("removeSavedPlaceDB():"+JSON.stringify(e))}