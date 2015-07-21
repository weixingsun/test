function initVars(){
	Ti.App.Properties.setInt("MODE",0);//0-none/1-navi/
	setNodes('');
	Ti.App.Properties.setInt("myCircle",0);
	Ti.App.Properties.setInt("mySpot",0);
	Ti.App.Properties.setInt("dest",0);
	Ti.App.Properties.setInt('route',0);
	Ti.App.Properties.setString('RouteMarkers','');
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
	Ti.App.Properties.setString('GH_TURN_DICT',JSON.stringify(GH_TURN_DICT));
}
var AllViews={};
function getLabelById(id){
   return AllViews[id];
}
function getNodes(){
	return Ti.App.Properties.getString('Nodes');
}
function setNodes(value){
	Ti.App.Properties.setString('Nodes',value);
}