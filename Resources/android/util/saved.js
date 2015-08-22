function findSavedMarker(inlatlng){
	var places = selectAllPlacesDB();//lat:lng:name
	for(var i=0;i<places.length;i++){
		var lat=places[i].lat;
		var lng=places[i].lng;
		var dist = distance(lat,lng,inlatlng[0],inlatlng[1]);
		var zoom= Math.round( map.getZoomLevel() );
		var tap = tapRange(zoom,dist);
		if(tap){
			return places[i];
		}
	}
	return null;
}
function tapRange(zoom,dist){
	var value=false;
	Ti.API.info('zoom='+zoom+',dist='+dist);
	switch(zoom){
		case 20: value=dist<3?true:false; break;
		case 19: value=dist<5?true:false;break;
		case 18: value=dist<10?true:false; break;
		case 17: value=dist<20?true:false; break;
		case 16: value=dist<30?true:false; break;
		case 15: value=dist<50?true:false; break;
		case 14: value=dist<150?true:false; break;
		case 13: value=dist<300?true:false; break;
		case 12: value=dist<500?true:false; break;
		case 11: value=dist<1000?true:false; break;
		case 10: value=dist<2000?true:false; break;
		case 10: value=dist<4000?true:false; break;
		case 9: value=dist<6000?true:false; break;
		case 8: value=dist<10000?true:false; break;
		case 7: value=dist<20000?true:false; break;
		case 6: value=dist<30000?true:false; break;
		case 5: value=dist<40000?true:false; break;
		case 4: value=dist<50000?true:false; break;
	}
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
		//Ti.API.info('selectDB='+sql);
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