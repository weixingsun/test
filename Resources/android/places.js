function Places(){
	this.searchResult;
};
Places.prototype.showAllSavedPlaceMarkers=function (data){
	this.deleteSavedPlaceMarkerDB('1=1');
	var dbPlaces = this.selectAllPlacesDB();
	if(dbPlaces!=null){
		for(var i=0;i<dbPlaces.length;i++){
		    var id=Ti.App.Android.R.drawable.star_red_24;
		    var pp = [dbPlaces[i].lat,dbPlaces[i].lng];//.toFixed(6)
		    //var name = 'saved_'+dbPlaces[i].lat+'_'+dbPlaces[i].lng;
		    var mkid=map.addMarker(pp,id);
		    var item={lat:pp[0],lng:pp[1],id:mkid};
			this.addSavedPlaceMarkerDB(item);
		}
	}
};
Places.prototype.isSavedPlacesDB=function(latlng){
	if(this.selectASavedPlaceDB(latlng) !== null) return true;
	return false;
};
/*Places.prototype.allCctvCSV=function(latlng){
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'raw','nz_cctv.csv');
	var csv = f.read();
	var points = [];
	var alllines = csv.toString().split("\n");
	for (var c=0;c<alllines.length;c++) {
		var data = alllines[c].split(",");
		if (data.length > 1) {
			var entry = {'lat':data[1],'lng':data[0],'speed':[2],'name':data[3]};
			points[c]=entry;
		}
	}
	return points;
};*/
Places.prototype.selectASavedPlaceMarkerDB=function (latlng){
	var table = 'saved_marker_id';
	var columns = 'lat,lng,id';
	var where = "lat='"+latlng[0]+"' and lng='"+latlng[1]+"'";
	var records = this.selectDB('wx_map',table,columns,where);
	//Ti.API.info('selectASavedPlaceMarkerDB()'+strlatlng+' db_record='+JSON.stringify(records));
	if(records!=null && records.length>0) return records[0];
	return null;
};
Places.prototype.selectASavedPlaceDB=function (latlng){
	var table = 'saved_places';
	var columns = 'lat,lng,name';
	var where = "lat='"+latlng[0]+"' and lng='"+latlng[1]+"'";
	var records = this.selectDB('wx_map',table,columns,where);
	//Ti.API.info('selectASavedPlaceDB()'+strlatlng+' db_record='+JSON.stringify(records));
	if(records!=null && records.length>0) return records[0];
	return null;
};
Places.prototype.selectAllPlacesDB = function (){
	var table = 'saved_places';
	var columns = 'lat,lng,name';
	var where = '1=1';
	return this.selectDB('wx_map',table,columns,where);
};
Places.prototype.selectDB = function (dbname,table,columns,where){
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
};

Places.prototype.deleteSavedPlaceMarkerDB = function (where){
	this.deleteDB('saved_marker_id',where);
};
Places.prototype.removeSavedPlaceMarker =function(place){
	var marker = this.selectASavedPlaceMarkerDB(place);
	var where = "lat='"+marker.lat+"' and lng='"+marker.lng+"'";
	this.deleteSavedPlaceMarkerDB(where);
	map.removeMarker(marker.id);
};
Places.prototype.removeSavedPlaceDB =function(place){
	var where = "lat='"+place.lat+"' and lng='"+place.lng+"'";
	this.deleteDB('saved_places',where);
};
Places.prototype.deleteDB = function (table,where){
	var db;
	try{
		db = Ti.Database.open('wx_map');
		//var param = [place.lat,place.lng];
		//db.execute('delete from '+table+' where lat=? and lng=?',param);
		var sql = 'delete from '+table+' where '+where;
		//Ti.API.info('deleteDB()sql:'+sql);
		db.execute(sql);
	}finally{
		if(db!==null) db.close();
	}
};

Places.prototype.addSavedPlaceMarkerDB = function (placeMarker){	//{lat:0,lng:0,id:'0'}
	var tbl_col = 'saved_marker_id(lat,lng,id) values(?,?,?)';
	var param = [placeMarker.lat,placeMarker.lng, placeMarker.id];
	this.insertDB(tbl_col,param);
};
Places.prototype.addSavedPlaceMarker = function (latlng){
    var img=Ti.App.Android.R.drawable.star_red_24;
    var name = 'saved_'+latlng[0]+'_'+latlng[1];
    var mkid=map.addMarker(latlng,img);
    var placeMarker = {lat:latlng[0],lng:latlng[1],id:mkid};
    this.addSavedPlaceMarkerDB(placeMarker);
};
Places.prototype.addSavedPlaceDB = function (place){
	var tbl_col = 'saved_places(lat,lng,name) values(?,?,?)';
	var param = [place.lat,place.lng, place.name];
	this.insertDB(tbl_col,param);
};
Places.prototype.insertDB = function (table_columns,values){	//{lat:0,lng:0,name:'0'}
	var db;
	try{
		db = Ti.Database.open('wx_map');
		db.execute('insert into '+table_columns,values);
	}finally{
		if(db!==null) db.close();
	}
	//Ti.API.info('insertDB():'+table_columns+' value:'+values);
};

Places.prototype.createSavedPlaceTable = function (){
	var db = Ti.Database.open('wx_map');
	db.execute('CREATE TABLE IF NOT EXISTS saved_places(lat varchar(20), lng varchar(20), name varchar(100));');
	db.execute('CREATE TABLE IF NOT EXISTS saved_marker_id(lat varchar(20), lng varchar(20), id varchar(100));');
	db.close();
	//db.file.setRemoteBackup(false);
};
Places.prototype.findSavedMarker =function (inlatlng){
	var zoom= Math.round( map.mapView.getZoomLevel() );
	var range = this.getTapRange(zoom);	//in meter
	//var diffLat = getDiffLat(range);
	//var diffLng = getDiffLng(range,inlatlng[0]);
	//var whereLat = 'lat between '+(inlatlng[0]-diffLat)+' and '+(inlatlng[0]+diffLat);
	//var whereLng = 'lng between '+(inlatlng[1]-diffLng)+' and '+(inlatlng[1]+diffLng);
	//var where = whereLat+ ' and '+whereLng;
	//selectPlacesDB(where);
	var places = this.selectAllPlacesDB();//lat:lng:name
	for(var i=0;i<places.length;i++){
		var lat=places[i].lat;
		var lng=places[i].lng;
		var dist = distance(lat,lng,inlatlng[0],inlatlng[1]);
		if(dist<range){
			return places[i];
		}
	}
	return null;
};
Places.prototype.getTapRange =function (zoom){
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
};
Places.prototype.makePoiSql = function(addressName,country){
	var uname = addressName.replace(/'/g, "''"); //.replace(/\\/g, "\\\\");
	var me = map.getCurrentPos();
	var table = 'poi';
	var columns = 'lat,lng,pname';	//,admin,country_code
	var where = "pname match '*"+uname+"*'";
	var diffLat = me[0]+"-lat";
	var diffLng = me[1]+"-lng";
	var order = "("+diffLat+")*("+diffLat+")+("+diffLng+")*("+diffLng+")  asc limit 0,20";
	return "select "+columns+" from "+table+" where "+where+" order by "+order;
};
Places.prototype.searchOfflinePOI = function(name,country){
	var that=this;
	var strSQL=that.makePoiSql(name,country);
	var poiFile = "/"+Ti.App.id+"/poi/"+country+".db";
	//return selectDB(country,sql,callback);
	var data ={sql:strSQL,db:poiFile,};
	//Ti.API.info('searchOfflinePOI():sql'+strSQL+' dbFile:'+poiFile +'json='+JSON.stringify(data));
	map.navimodule.queryFTS(data, function(result) {
	  //Ti.API.info('search records='+JSON.stringify(result.rows));
	  views.fillSearchList(result.rows,"Offline");
	  views.showSearchList();
	  if(result.rows.length<1) net.searchNameAddressGoogle(name,country);
	});
};
Places.prototype.searchOfflineCctv = function (latlng){
	var that=this;
	var rangeLatLng = 0.1;
	var country = 'nz';
	var str_lat = " lat between "+(latlng[0]-rangeLatLng)+" and "+(latlng[0]+rangeLatLng);
	var str_lng = " and lng between "+(latlng[1]-rangeLatLng)+" and "+(latlng[1]-rangeLatLng);
	var strSQL = "select lat,lng,speed from cctv where "+str_lat+str_lng;
	var poiFile = "/"+Ti.App.id+"/poi/"+country+".db";
	var data ={sql:strSQL,db:poiFile,};
	map.navimodule.queryFTS(data, function(result) {
	  Ti.API.info('cctv search:'+JSON.stringify(result.rows));
	  //if(records!=null){} //voice hint
	  that.searchResult=result;
	});
	if(that.searchResult!=null) return that.searchResult;
	return null;
};