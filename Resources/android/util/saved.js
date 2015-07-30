function findSavedMarker(inlatlng,inxy){
	var zoom = map.getZoomLevel();
	//Ti.API.info('findSavedMarker()'+'zoom='+zoom+' latlng:'+inlatlng);//XY:inxy
	var places = JSON.parse(Ti.App.Properties.getString('SavedPlaceMarkers'));
	for(var i=0;i<places.length;i++){
		var latlng=places[i].latlng;
		var dist = distance(latlng[0],latlng[1],inlatlng[0],inlatlng[1]);
		//var xy = map.toPixels(latlng);
		//Ti.API.info('loop:dist='+dist);
		var tap = tapRange(zoom,dist);
		if(tap){
			return places[i];
		}
	}
	return null;
}
function tapRange(zoom,dist){
	var value=false;
	switch(zoom){
		case 20: value=dist<3?true:false; break;
		case 19: value=dist<5?true:false; break;
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
	db.close();
	//db.file.setRemoteBackup(false);
}
function showAllSavedPlaceMarkers(){
	var places = selectAllPlacesDB();
	var savedPlaceMarkerIds=[];
	for(var i=0;i<places.length;i++){
	    var pp = [places[i].lat,places[i].lng];//.toFixed(6)
	    var id=Ti.App.Android.R.drawable.star_red_24;
	    var mkid=addMarker(map,pp,id);
	    var item={mk:mkid,latlng:pp};
		savedPlaceMarkerIds.push(item);
	}
	var strValue=JSON.stringify(savedPlaceMarkerIds);
	Ti.App.Properties.setString('SavedPlaceMarkers',strValue);
	Ti.API.info('SavedPlaceMarkers='+strValue);
}

function removeSavedPlaceMarker(inlatlng){
	var strValue = Ti.App.Properties.getString('SavedPlaceMarkers');
	var places = JSON.parse(strValue);
	for(var i=0;i<places.length;i++){
		var latlng=places[i].latlng;
		var mkid = places[i].mk;
		//Ti.API.info('removeSavedPlaceMarker() latlng='+latlng+', inlatlng='+inlatlng);
		//if(latlng == inlatlng){
		if(JSON.stringify(latlng) == JSON.stringify(inlatlng)){
			removeLayer(mkid);
			places.removeAt(i);
		}
	}
	var strValue=JSON.stringify(places);
	Ti.API.info('removeSavedPlaceMarker='+strValue);
	Ti.App.Properties.setString('SavedPlaceMarkers',strValue);
}
function addSavedPlaceMarker(latlng){
	var strValue = Ti.App.Properties.getString('SavedPlaceMarkers');
	var places = JSON.parse(strValue);
    var id=Ti.App.Android.R.drawable.star_red_24;
    var mkid=addMarker(map,latlng,id);
    var item={mk:mkid,latlng:latlng};
	places.push(item);
	var strValue=JSON.stringify(places);
	Ti.API.info('SavedPlaceMarkers='+strValue);
	Ti.App.Properties.setString('SavedPlaceMarkers',strValue);
}
function selectAllPlacesDB(){
	var db,rows;
	var data =[];
	try {
		db = Ti.Database.open('wx_map');
		rows = db.execute('select * from saved_places;');
		while (rows.isValidRow()){
			data.push({
				lat:rows.fieldByName('lat'),
				lng:rows.fieldByName('lng'),
				name:rows.fieldByName('name'),
			});
			rows.next();
		}
		Ti.API.info('selectAllPlacesDB()row#'+rows.rowCount);
	}finally{
		if(rows!==null) rows.close();
		if(db!==null) db.close();
    }
	//db.file.setRemoteBackup(false);
	return data;
}
function selectASavedPlace(strlatlng){
	var db;
	var data =[];
	try {
		db = Ti.Database.open('wx_map');
		var latlng = JSON.parse(strlatlng);
		var rows = db.execute('select * from saved_places where lat=? and lng=? ',latlng);
		if(rows.rowCount<1) return null;
		while (rows.isValidRow()){
			data.push({
				lat:rows.fieldByName('lat'),
				lng:rows.fieldByName('lng'),
				name:rows.fieldByName('name'),
			});
			rows.next();
		}
	}finally{
		if(rows!==null) rows.close();
		if(db!==null) db.close();
	}
	return data[0];
}
function isSavedPlacesDB(strlatlng){	//'[lat,lng]'
	var saved = false;
	var place = selectASavedPlace(strlatlng);
	if(place !== null) saved=true;
	return saved;
}
function addSavedPlaceDB(place){	//{lat:0,lng:0,name:'0'}
	var db;
	try{
		db = Ti.Database.open('wx_map');
		var param = [place.lat,place.lng, place.name];
		db.execute('insert into saved_places(lat,lng,name) values(?,?,?)',param);
	}finally{
		if(db!==null) db.close();
	}
	Ti.API.info('addSavedPlaceDB():'+JSON.stringify(place));
}
function removeSavedPlaceDB(place){
	var db;
	try{
		db = Ti.Database.open('wx_map');
		var param = [place.lat,place.lng];
		db.execute('delete from saved_places where lat=? and lng=?',param);
	}finally{
		if(db!==null) db.close();
	}
	Ti.API.info('removeSavedPlaceDB():'+JSON.stringify(place));
}
function updateSavedPlaceDB(place){
	var db;
	try{
		db = Ti.Database.open('wx_map');
		var param = [place.lat,place.lng];
		db.execute('delete from saved_places where lat=? and lng=?',param);
	}finally{
		if(db!==null) db.close();
	}
	//db.file.setRemoteBackup(false);
	Ti.API.info('removeSavedPlaceDB():'+JSON.stringify(place));
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