function findSavedMarker(point){
	Ti.API.info('findSavedMarker():'+JSON.stringify(point));
}

function createSavedPlaceTable(){
	var db = Ti.Database.open('wx_map');
	db.execute('CREATE TABLE IF NOT EXISTS saved_places(lat varchar(10), lng varchar(10), name varchar(100));');
	db.close();
	//db.file.setRemoteBackup(false);
}
function showAllSavedPlaceMarkers(){
	var places = selectAllPlacesDB();
	var savedPlaceMarkerIds=[];
	for(var i=0;i<places.length;i++){
	    var pp = [places[i].lat,places[i].lng];
	    var id=Ti.App.Android.R.drawable.star_red_24;
		//Ti.API.info('map:'+map+',pp='+pp+',id='+id);
	    var mkid=addMarker(map,pp,id);
		savedPlaceMarkerIds.push(mkid);
	}
	Ti.App.Properties.setString('SavedPlaceMarkers',JSON.stringify(savedPlaceMarkerIds));
}

function selectAllPlacesDB(){
	var db = Ti.Database.open('wx_map');
	var rows = db.execute('select * from saved_places;');
	var data =[];
	while (rows.isValidRow()){
		data.push({
			lat:rows.fieldByName('lat'),
			lng:rows.fieldByName('lng'),
			name:rows.fieldByName('name'),
		});
		rows.next();
	}
	Ti.API.info('selectAllPlacesDB()row#'+rows.rowCount);
	rows.close();
	db.close();
	//db.file.setRemoteBackup(false);
	return data;
}
function selectASavedPlace(strlatlng){
	var db = Ti.Database.open('wx_map');
	var latlng = JSON.parse(strlatlng);
	var row = db.execute('select * from saved_places where lat=? and lng=? ',latlng);
	var data =[];
	if(row.rowCount<1) return null;
	while (row.isValidRow()){
		data.push({
			lat:row.fieldByName('lat'),
			lng:row.fieldByName('lng'),
			name:row.fieldByName('name'),
		});
		row.next();
	}
	row.close();
	db.close();
	return data[0];
}
function isSavedPlacesDB(strlatlng){	//'[lat,lng]'
	var saved = false;
	var place = selectASavedPlace(strlatlng);
	if(place !== null) saved=true;
	return saved;
}
function addSavedPlaceDB(place){	//{lat:0,lng:0,name:'0'}
	var db = Ti.Database.open('wx_map');
	var param = [place.lat,place.lng, place.name];
	db.execute('insert into saved_places(lat,lng,name) values(?,?,?)',param);
	db.close();
	//db.file.setRemoteBackup(false);
	Ti.API.info('addSavedPlaceDB():'+JSON.stringify(place));
}
function removeSavedPlaceDB(place){
	var db = Ti.Database.open('wx_map');
	var param = [place.lat,place.lng];
	db.execute('delete from saved_places where lat=? and lng=?',param);
	db.close();
	//db.file.setRemoteBackup(false);
	Ti.API.info('removeSavedPlaceDB():'+JSON.stringify(place));
}
//////////////////////////////////////////////////////////////////////////////
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
}