if (!Array.prototype.remove) {
  Array.prototype.remove = function(val) {
    var i = this.indexOf(val);
    return i>-1 ? this.splice(i, 1) : [];
  };
  Array.prototype.removeAt = function(i) {
    return i>-1 ? this.splice(i, 1) : [];
  };
}
String.prototype.startWith=function(str){  
    if(str==null||str==""||this.length==0||str.length>this.length)  
      return false;  
    if(this.substr(0,str.length)==str)  
      return true;  
    else  
      return false;  
    return true;  
};
String.prototype.endWith=function(str){  
    if(str==null||str==""||this.length==0||str.length>this.length)  
      return false;  
    if(this.substring(this.length-str.length)==str)  
      return true;  
    else  
      return false;  
    return true;  
};
var GOOGLE_API_KEY = 'AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A';
function isGoogleMap(){
	//var str = Ti.App.Properties.getString('map_type');
	return map_type.startWith('google');
}
function addMarker(name,latlng,img,draggable){
	if(isGoogleMap()){
		return addMyGoogleMarker(name,latlng[0],latlng[1],img,draggable);
	}else{
		return addMarkerMF([latlng[0],latlng[1]],img);
	}
}
function removeMarker(id){
	if(isGoogleMap()){
		map.removeMarker(id);
	}else{
		map.removeLayer(id);
	}
}
var map_type;
function initVars(mapType){
	Ti.App.Properties.setString('map_type',mapType);//mapsforge.offline/google.sattlite/google.normal
	map_type = mapType;
	Ti.App.Properties.setInt("MODE",0);//0-none/1-navi/
	setNodes('');
	Ti.App.Properties.setInt("myCircle",0);
	Ti.App.Properties.setInt("mySpot",0);
	Ti.App.Properties.setString("dest_marker",'');
	Ti.App.Properties.setInt('route',0);
	Ti.App.Properties.setString('RouteMarkers','');
	Ti.App.Properties.setString('by','car');
	var GH_TURN_DICT={
		"-3":"turn_sharp_left",
		"-2":"turn_left",
		"-1":"turn_slight_left",
		"0":"continue",
		"1":"turn_slight_right",
		"2":"turn_right",
		"3":"turn_sharp_right",
		"4":"finish",
		"5":"reached_via",
		"6":"use_roundabout"
	};
	var GH_TURN_DICT2={
		"-3":"turn sharp left",
		"-2":"turn left",
		"-1":"turn slight left",
		"0":"continue",
		"1":"turn slight right",
		"2":"turn right",
		"3":"turn sharp right",
		"4":"finish",
		"5":"reached via",
		"6":"use roundabout"
	};
	var BYS = ["car","bike","foot"];
	var BY_ICONS = [Ti.App.Android.R.drawable.sedan_128,Ti.App.Android.R.drawable.bicycle_128,Ti.App.Android.R.drawable.runner_128];
	Ti.App.Properties.setString('bys',JSON.stringify(BYS));
	Ti.App.Properties.setString('by_icons',JSON.stringify(BY_ICONS));
	Ti.App.Properties.setString('GH_TURN_DICT',JSON.stringify(GH_TURN_DICT2));////////////////////////
	setDestinatePos([0,0]);
	Ti.App.Properties.setString('played','{}');
	Ti.App.Properties.setString('SavedPlaceMarkers','[]');
}
function setNaviMode(mode){
	Ti.App.Properties.setInt("MODE",mode);
}
function setSettingBy(by){
	Ti.App.Properties.setString('by',by);
}
function saveRouteInfo(nodes){
	Ti.App.Properties.setString('Nodes',JSON.stringify(nodes));
}
function savePolylineId(id){
	Ti.App.Properties.setInt('route',id);
}
function saveNodeMarker(nodeMarkerIds){
	Ti.App.Properties.setString('RouteMarkers',JSON.stringify(nodeMarkerIds));
}
	
function setEmptyPlayedList(list){
	var played = {};
	//for (var i=0;i<list.length;i++){
		//played[''+i+"_0"]='';
		//played[''+i+"_100"]='';
		//played[''+i+"_200"]='';
		//played[''+i+"_500"]='';
		//played[''+i+"_1000"]='';
		//played[''+i+"_2000"]='';
	//}
	Ti.App.Properties.setString('played',JSON.stringify(played));
}
function setPlayedList(id,dist){
	var list = JSON.parse(Ti.App.Properties.getString('played'));
	list[''+id+"_"+dist]='y';
	Ti.App.Properties.setString('played',JSON.stringify(list));
}
//
function isPlayed(id,dist){
	var list = JSON.parse(Ti.App.Properties.getString('played'));
	if(list[''+id+"_"+dist] !== undefined && list[''+id+"_"+dist]==='y') return true;
	return false;
}
function getGHDict(){
	var strGH = Ti.App.Properties.getString('GH_TURN_DICT');
	return JSON.parse(strGH);
}
var AllViews={"car_img":0,"pop":0,"place_name1":0,"place_name2":0};
function getLabelById(id){
   return AllViews[id];
}
function getNodes(){
	return Ti.App.Properties.getString('Nodes');
}
function setNodes(value){
	Ti.App.Properties.setString('Nodes',value);
}