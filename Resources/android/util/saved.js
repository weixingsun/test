function findSavedMarker(inlatlng){
	var zoom= Math.round( map.getZoomLevel() );
	var range = getTapRange(zoom);	//in meter
	//var diffLat = getDiffLat(range);
	//var diffLng = getDiffLng(range,inlatlng[0]);
	//var whereLat = 'lat between '+(inlatlng[0]-diffLat)+' and '+(inlatlng[0]+diffLat);
	//var whereLng = 'lng between '+(inlatlng[1]-diffLng)+' and '+(inlatlng[1]+diffLng);
	//var where = whereLat+ ' and '+whereLng;
	//selectPlacesDB(where);
	var places = selectAllPlacesDB();//lat:lng:name
	for(var i=0;i<places.length;i++){
		var lat=places[i].lat;
		var lng=places[i].lng;
		var dist = distance(lat,lng,inlatlng[0],inlatlng[1]);
		if(dist<range){
			return places[i];
		}
	}
	return null;
}
function getDiffLat(m){
	// 1 lat = 110574 m
	// 1 long= 111320*cos(latitude) m
	return m/110574.0;
}
function getDiffLng(m,lat){
	// 1 lat = 110574 m
	// 1 long= 111320*cos(latitude) m
	return m/(111320.0*Math.cos(lat));
}
function getTapRange(zoom){
	switch(zoom){
		case 20: return 3;
		case 19: return 5;
		case 18: return 10;
		case 17: return 20;
		case 16: return 30;
		case 15: return 50;
		case 14: return 150;
		case 13: return 300;
		case 12: return 500;
		case 11: return 1000;
		case 10: return 2000;
		case 10: return 4000;
		case 9:  return 6000;
		case 8:  return 10000;
		case 7:  return 20000;
		case 6:  return 30000;
		case 5:  return 40000;
		case 4:  return 50000;
	}
}
function tapRange(zoom,dist){
	var value=false;
	//Ti.API.info('zoom='+zoom+',dist='+dist);
	if(dist<getTapRange(zoom)) return true;
	return value;
}

function createSavedPlaceTable(){
	var db = Ti.Database.open('wx_map');
	db.execute('CREATE TABLE IF NOT EXISTS saved_places(lat varchar(20), lng varchar(20), name varchar(100));');
	db.execute('CREATE TABLE IF NOT EXISTS saved_marker_id(lat varchar(20), lng varchar(20), id varchar(100));');
	db.close();
	//db.file.setRemoteBackup(false);
}
function showAllSavedPlaceMarkers(){
	deleteSavedPlaceMarkerDB('1=1');
	var places = selectAllPlacesDB();
	if(places!=null){
		for(var i=0;i<places.length;i++){
		    var id=Ti.App.Android.R.drawable.star_red_24;
		    var pp = [places[i].lat,places[i].lng];//.toFixed(6)
		    var name = 'saved_'+places[i].lat+'_'+places[i].lng;
		    var mkid=addMarker(name,pp,id,false);
		    var item={lat:pp[0],lng:pp[1],id:mkid};
			addSavedPlaceMarkerDB(item);
		}
	}
}
function compare(latlng1, latlng2){
	//if(Math.abs(var1-var2)<0.000001) return true;
	//Ti.API.info('compare: '+latlng1+', '+latlng2);
	var lat1 = Number(latlng1.toString().split(',')[0]);
	var lng1 = Number(latlng1.toString().split(',')[1]);
	var lat2 = Number(latlng2.toString().split(',')[0]);
	var lng2 = Number(latlng2.toString().split(',')[1]);
	if(lat1.toFixed(6)==lat2.toFixed(6) &&
	   lng1.toFixed(6)==lng2.toFixed(6)
	  ){
		//Ti.API.info(lat1+','+lng1+' = '+lat2+','+lng2);
		return true;
	} else{
		//Ti.API.info(lat1+','+lng1+' != '+lat2+','+lng2);
		return false;
	}
}
function removeSavedPlaceMarker(inlatlng){
	///////////////////////////////////////////////////////
	var marker = selectASavedPlaceMarkerDB(JSON.stringify(inlatlng));
	var where = "lat='"+marker.lat+"' and lng='"+marker.lng+"'";
	deleteSavedPlaceMarkerDB(where);
	removeMarker(marker.id);
}
function addSavedPlaceMarker(latlng){
    var img=Ti.App.Android.R.drawable.star_red_24;
    var name = 'saved_'+latlng[0]+'_'+latlng[1];
    var mkid=addMarker(name,latlng,img,false);
    var placeMarker = {lat:latlng[0],lng:latlng[1],id:mkid};
    addSavedPlaceMarkerDB(placeMarker);
}
function selectAllPlacesDB(){
	var table = 'saved_places';
	var columns = 'lat,lng,name';
	var where = '1=1';
	return selectDB('wx_map',table,columns,where);
}
function selectPlacesDB(where){
	var table = 'saved_places';
	var columns = 'lat,lng,name';
	//var where = '1=1';
	return selectDB('wx_map',table,columns,where);
}
function selectASavedPlaceDB(strlatlng){
	var table = 'saved_places';
	var columns = 'lat,lng,name';
	var latlng = JSON.parse(strlatlng);
	var where = "lat='"+latlng[0]+"' and lng='"+latlng[1]+"'";
	var records = selectDB('wx_map',table,columns,where);
	//Ti.API.info('selectASavedPlaceDB()'+strlatlng+' db_record='+JSON.stringify(records));
	if(records!=null && records.length>0) return records[0];
	return null;
}
function isSavedPlacesDB(strlatlng){
	var saved = false;
	var place = selectASavedPlaceDB(strlatlng);
	if(place !== null) saved=true;
	return saved;
}
function addSavedPlaceDB(place){	//{lat:0,lng:0,name:'0'}
	var tbl_col = 'saved_places(lat,lng,name) values(?,?,?)';
	var param = [place.lat,place.lng, place.name];
	insertDB(tbl_col,param);
}
function addSavedPlaceMarkerDB(placeMarker){	//{lat:0,lng:0,id:'0'}
	var tbl_col = 'saved_marker_id(lat,lng,id) values(?,?,?)';
	var param = [placeMarker.lat,placeMarker.lng, placeMarker.id];
	insertDB(tbl_col,param);
}
function deleteSavedPlaceMarkerDB(where){
	deleteDB('saved_marker_id',where);
}
function selectASavedPlaceMarkerDB(strlatlng){
	var table = 'saved_marker_id';
	var columns = 'lat,lng,id';
	var latlng = JSON.parse(strlatlng);
	var where = "lat='"+latlng[0]+"' and lng='"+latlng[1]+"'";
	var records = selectDB('wx_map',table,columns,where);
	Ti.API.info('selectASavedPlaceMarkerDB()'+strlatlng+' db_record='+JSON.stringify(records));
	if(records!=null && records.length>0) return records[0];
	return null;
}
function removeSavedPlaceDB(place){
	var where = "lat='"+place.lat+"' and lng='"+place.lng+"'";
	deleteDB('saved_places',where);
}
function updateSavedPlaceDB(place){
	var db;
	try{
		db = Ti.Database.open('wx_map');
		var param = [place.lat,place.lng];
		db.execute('update saved_places where lat=? and lng=?',param);
	}finally{
		if(db!==null) db.close();
	}
	//db.file.setRemoteBackup(false);
	Ti.API.info('removeSavedPlaceDB():'+JSON.stringify(place));
}
//where=" lat=? and lng=?"
//table="saved_places"
function deleteDB(table,where){
	var db;
	try{
		db = Ti.Database.open('wx_map');
		//var param = [place.lat,place.lng];
		//db.execute('delete from '+table+' where lat=? and lng=?',param);
		var sql = 'delete from '+table+' where '+where;
		Ti.API.info('deleteDB()sql:'+sql);
		db.execute(sql);
	}finally{
		if(db!==null) db.close();
	}
}
//table_columns: 'table(col1,col2) values(?,?)'
//values: [value1,value2]
function insertDB(table_columns,values){	//{lat:0,lng:0,name:'0'}
	var db;
	try{
		db = Ti.Database.open('wx_map');
		db.execute('insert into '+table_columns,values);
	}finally{
		if(db!==null) db.close();
	}
	//Ti.API.info('insertDB():'+table_columns+' value:'+values);
}
function selectDB(dbname,table,columns,where){
	var db;
	var data =[];
	var vColumns = columns.split(',');
	try {
		db = Ti.Database.open(dbname);
		var sql = 'select '+columns+' from '+table+' where '+where;
		Ti.API.info('selectDB='+sql);
		var rows = db.execute(sql);
		if(rows.rowCount<1) return null;
		while (rows.isValidRow()){
			var result={};
			for(var i = 0; i < vColumns.length; i++)
			{
			    result[vColumns[i]] = rows.fieldByName(vColumns[i]);
			}
			data.push(result);
			rows.next();
		}
	}finally{
		if(rows!==null) rows.close();
		if(db!==null) db.close();
	}
	return data;
}
/*
function getAllSavedPlaces(){
	var saved = Ti.App.Properties.getString('SAVED_PLACES');
	Ti.API.info('places='+saved);
	return JSON.parse(saved);
}
function saveAllSavedPlaces(places){
	Ti.App.Properties.setString('SAVED_PLACES',JSON.stringify(places));
}
function isSavedPlaces(strlatlng){
	var places = getAllSavedPlaces();
	return (strlatlng in places);
}
function addSavedPlace(item){
	var places = getAllSavedPlaces();
	places.push({
		latlng:JSON.stringify(item.latlng),
		name:item.name
	});
	saveAllSavedPlaces(places);
	Ti.API.info('addSavedPlace():'+JSON.stringify(places));
}
function removeSavedPlace(item){
	var places = getAllSavedPlaces();
	delete places[JSON.stringify(item.latlng)];
	saveAllSavedPlaces(places);
	Ti.API.info('removeSavedPlace():'+JSON.stringify(places));
}*/