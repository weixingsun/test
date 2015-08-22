function findSavedMarker(e){for(var a=selectAllPlacesDB(),t=0;t<a.length;t++){var i=a[t].lat,r=a[t].lng,n=distance(i,r,e[0],e[1]),o=Math.round(map.getZoomLevel()),l=tapRange(o,n);if(l)return a[t]}return null}function tapRange(e,a){var t=!1;switch(Ti.API.info("zoom="+e+",dist="+a),e){case 20:t=3>a?!0:!1;break;case 19:t=5>a?!0:!1;break;case 18:t=10>a?!0:!1;break;case 17:t=20>a?!0:!1;break;case 16:t=30>a?!0:!1;break;case 15:t=50>a?!0:!1;break;case 14:t=150>a?!0:!1;break;case 13:t=300>a?!0:!1;break;case 12:t=500>a?!0:!1;break;case 11:t=1e3>a?!0:!1;break;case 10:t=2e3>a?!0:!1;break;case 10:t=4e3>a?!0:!1;break;case 9:t=6e3>a?!0:!1;break;case 8:t=1e4>a?!0:!1;break;case 7:t=2e4>a?!0:!1;break;case 6:t=3e4>a?!0:!1;break;case 5:t=4e4>a?!0:!1;break;case 4:t=5e4>a?!0:!1}return t}function createSavedPlaceTable(){var e=Ti.Database.open("wx_map");e.execute("CREATE TABLE IF NOT EXISTS saved_places(lat varchar(20), lng varchar(20), name varchar(100));"),e.execute("CREATE TABLE IF NOT EXISTS saved_marker_id(lat varchar(20), lng varchar(20), id varchar(100));"),e.close()}function showAllSavedPlaceMarkers(){deleteSavedPlaceMarkerDB("1=1");var e=selectAllPlacesDB();if(null!=e)for(var a=0;a<e.length;a++){var t=Ti.App.Android.R.drawable.star_red_24,i=[e[a].lat,e[a].lng],r="saved_"+e[a].lat+"_"+e[a].lng,n=addMarker(r,i,t,!1),o={lat:i[0],lng:i[1],id:n};addSavedPlaceMarkerDB(o)}}function compare(e,a){var t=Number(e.toString().split(",")[0]),i=Number(e.toString().split(",")[1]),r=Number(a.toString().split(",")[0]),n=Number(a.toString().split(",")[1]);return t.toFixed(6)==r.toFixed(6)&&i.toFixed(6)==n.toFixed(6)?!0:!1}function removeSavedPlaceMarker(e){var a=selectASavedPlaceMarkerDB(JSON.stringify(e)),t="lat='"+a.lat+"' and lng='"+a.lng+"'";deleteSavedPlaceMarkerDB(t),removeMarker(a.id)}function addSavedPlaceMarker(e){var a=Ti.App.Android.R.drawable.star_red_24,t="saved_"+e[0]+"_"+e[1],i=addMarker(t,e,a,!1),r={lat:e[0],lng:e[1],id:i};addSavedPlaceMarkerDB(r)}function selectAllPlacesDB(){var e="saved_places",a="lat,lng,name",t="1=1";return selectDB("wx_map",e,a,t)}function selectASavedPlaceDB(e){var a="saved_places",t="lat,lng,name",i=JSON.parse(e),r="lat='"+i[0]+"' and lng='"+i[1]+"'",n=selectDB("wx_map",a,t,r);return null!=n&&n.length>0?n[0]:null}function isSavedPlacesDB(e){var a=!1,t=selectASavedPlaceDB(e);return null!==t&&(a=!0),a}function addSavedPlaceDB(e){var a="saved_places(lat,lng,name) values(?,?,?)",t=[e.lat,e.lng,e.name];insertDB(a,t)}function addSavedPlaceMarkerDB(e){var a="saved_marker_id(lat,lng,id) values(?,?,?)",t=[e.lat,e.lng,e.id];insertDB(a,t)}function deleteSavedPlaceMarkerDB(e){deleteDB("saved_marker_id",e)}function selectASavedPlaceMarkerDB(e){var a="saved_marker_id",t="lat,lng,id",i=JSON.parse(e),r="lat='"+i[0]+"' and lng='"+i[1]+"'",n=selectDB("wx_map",a,t,r);return Ti.API.info("selectASavedPlaceMarkerDB()"+e+" db_record="+JSON.stringify(n)),null!=n&&n.length>0?n[0]:null}function removeSavedPlaceDB(e){var a="lat='"+e.lat+"' and lng='"+e.lng+"'";deleteDB("saved_places",a)}function updateSavedPlaceDB(e){var a;try{a=Ti.Database.open("wx_map");var t=[e.lat,e.lng];a.execute("update saved_places where lat=? and lng=?",t)}finally{null!==a&&a.close()}Ti.API.info("removeSavedPlaceDB():"+JSON.stringify(e))}function deleteDB(e,a){var t;try{t=Ti.Database.open("wx_map");var i="delete from "+e+" where "+a;Ti.API.info("deleteDB()sql:"+i),t.execute(i)}finally{null!==t&&t.close()}}function insertDB(e,a){var t;try{t=Ti.Database.open("wx_map"),t.execute("insert into "+e,a)}finally{null!==t&&t.close()}}function selectDB(e,a,t,i){var r,n=[],o=t.split(",");try{r=Ti.Database.open(e);var l="select "+t+" from "+a+" where "+i,s=r.execute(l);if(s.rowCount<1)return null;for(;s.isValidRow();){for(var d={},c=0;c<o.length;c++)d[o[c]]=s.fieldByName(o[c]);n.push(d),s.next()}}finally{null!==s&&s.close(),null!==r&&r.close()}return n}