if (!Array.prototype.remove) {
  Array.prototype.remove = function(val) {
    var i = this.indexOf(val);
    return i>-1 ? this.splice(i, 1) : [];
  };
}
if (!Array.prototype.removeAt) {
  Array.prototype.removeAt = function(i) {
    return i>-1 ? this.splice(i, 1) : [];
  };
}

function initVars(){
	Ti.App.Properties.setInt("MODE",0);//0-none/1-navi/
	setNodes('');
	Ti.App.Properties.setInt("myCircle",0);
	Ti.App.Properties.setInt("mySpot",0);
	Ti.App.Properties.setInt("dest_marker",0);
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
	var BYS = ["car","bike","foot"];
	var BY_ICONS = [Ti.App.Android.R.drawable.sedan_128,Ti.App.Android.R.drawable.bicycle_128,Ti.App.Android.R.drawable.runner_128];
	Ti.App.Properties.setString('bys',JSON.stringify(BYS));
	Ti.App.Properties.setString('by_icons',JSON.stringify(BY_ICONS));
	Ti.App.Properties.setString('GH_TURN_DICT',JSON.stringify(GH_TURN_DICT));
	setDestinatePos([0,0]);
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