function initVars(){Ti.App.Properties.setInt("MODE",0),setNodes(""),Ti.App.Properties.setInt("myCircle",0),Ti.App.Properties.setInt("mySpot",0),Ti.App.Properties.setInt("dest",0),Ti.App.Properties.setInt("route",0),Ti.App.Properties.setString("RouteMarkers",""),Ti.App.Properties.setString("by","car"),Ti.App.Properties.setString("by","car");var e={"-3":"turn_sharp_left","-2":"turn_left","-1":"turn_slight_left",0:"continue",1:"turn_slight_right",2:"turn_right",3:"turn_sharp_right",4:"finish",5:"reached_via",6:"use_roundabout"},i=["car","bike","foot"];Ti.App.Properties.setString("bys",JSON.stringify(i)),Ti.App.Properties.setString("GH_TURN_DICT",JSON.stringify(e))}function getLabelById(e){return AllViews[e]}function getNodes(){return Ti.App.Properties.getString("Nodes")}function setNodes(e){Ti.App.Properties.setString("Nodes",e)}var AllViews={};