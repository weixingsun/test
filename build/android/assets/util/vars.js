function initVars(){Ti.App.Properties.setInt("MODE",0),setNodes(""),Ti.App.Properties.setInt("myCircle",0),Ti.App.Properties.setInt("mySpot",0),Ti.App.Properties.setInt("dest_marker",0),Ti.App.Properties.setInt("route",0),Ti.App.Properties.setString("RouteMarkers",""),Ti.App.Properties.setString("by","car");var e={"-3":"turn_sharp_left","-2":"turn_left","-1":"turn_slight_left",0:"continue",1:"turn_slight_right",2:"turn_right",3:"turn_sharp_right",4:"finish",5:"reached_via",6:"use_roundabout"},i=["car","bike","foot"],t=[Ti.App.Android.R.drawable.sedan_128,Ti.App.Android.R.drawable.bicycle_128,Ti.App.Android.R.drawable.runner_128];Ti.App.Properties.setString("bys",JSON.stringify(i)),Ti.App.Properties.setString("by_icons",JSON.stringify(t)),Ti.App.Properties.setString("GH_TURN_DICT",JSON.stringify(e)),setDestinatePos([0,0]),Ti.App.Properties.setString("played","{}")}function setEmptyPlayedList(e){for(var i={},t=0;t<e.length;t++)i[""+t+"_0"]="";Ti.App.Properties.setString("played",JSON.stringify(i))}function setPlayedList(e,i){var t=JSON.parse(Ti.App.Properties.getString("played"));t[""+e+"_"+i]="y",Ti.App.Properties.setString("played",JSON.stringify(t))}function isPlayed(e,i){var t=JSON.parse(Ti.App.Properties.getString("played"));return"y"===t[""+e+"_"+i]?!0:!1}function getGHDict(){var e=Ti.App.Properties.getString("GH_TURN_DICT");return JSON.parse(e)}function getLabelById(e){return AllViews[e]}function getNodes(){return Ti.App.Properties.getString("Nodes")}function setNodes(e){Ti.App.Properties.setString("Nodes",e)}Array.prototype.remove||(Array.prototype.remove=function(e){var i=this.indexOf(e);return i>-1?this.splice(i,1):[]}),Array.prototype.removeAt||(Array.prototype.removeAt=function(e){return e>-1?this.splice(e,1):[]});var AllViews={car_img:0,pop:0,place_name1:0,place_name2:0};