function isGoogleMap(){var e=Ti.App.Properties.getString("map_type");return e.startWith("google")}function initVars(e){Ti.App.Properties.setString("map_type",e),Ti.App.Properties.setInt("MODE",0),setNodes(""),Ti.App.Properties.setInt("myCircle",0),Ti.App.Properties.setInt("mySpot",0),Ti.App.Properties.setInt("dest_marker",0),Ti.App.Properties.setInt("route",0),Ti.App.Properties.setString("RouteMarkers",""),Ti.App.Properties.setString("by","car");var t={"-3":"turn_sharp_left","-2":"turn_left","-1":"turn_slight_left",0:"continue",1:"turn_slight_right",2:"turn_right",3:"turn_sharp_right",4:"finish",5:"reached_via",6:"use_roundabout"},i=["car","bike","foot"],a=[Ti.App.Android.R.drawable.sedan_128,Ti.App.Android.R.drawable.bicycle_128,Ti.App.Android.R.drawable.runner_128];Ti.App.Properties.setString("bys",JSON.stringify(i)),Ti.App.Properties.setString("by_icons",JSON.stringify(a)),Ti.App.Properties.setString("GH_TURN_DICT",JSON.stringify(t)),setDestinatePos([0,0]),Ti.App.Properties.setString("played","{}")}function setNaviMode(e){Ti.App.Properties.setInt("MODE",e)}function setSettingBy(e){Ti.App.Properties.setString("by",e)}function saveRouteInfo(e){Ti.App.Properties.setString("Nodes",JSON.stringify(e))}function savePolylineId(e){Ti.App.Properties.setInt("route",e)}function saveNodeMarker(e){Ti.App.Properties.setString("RouteMarkers",JSON.stringify(e))}function setEmptyPlayedList(){var e={};Ti.App.Properties.setString("played",JSON.stringify(e))}function setPlayedList(e,t){var i=JSON.parse(Ti.App.Properties.getString("played"));i[""+e+"_"+t]="y",Ti.App.Properties.setString("played",JSON.stringify(i))}function isPlayed(e,t){var i=JSON.parse(Ti.App.Properties.getString("played"));return void 0!==i[""+e+"_"+t]&&"y"===i[""+e+"_"+t]?!0:!1}function getGHDict(){var e=Ti.App.Properties.getString("GH_TURN_DICT");return JSON.parse(e)}function getLabelById(e){return AllViews[e]}function getNodes(){return Ti.App.Properties.getString("Nodes")}function setNodes(e){Ti.App.Properties.setString("Nodes",e)}Array.prototype.remove||(Array.prototype.remove=function(e){var t=this.indexOf(e);return t>-1?this.splice(t,1):[]},Array.prototype.removeAt=function(e){return e>-1?this.splice(e,1):[]}),String.prototype.startWith=function(e){return null==e||""==e||0==this.length||e.length>this.length?!1:this.substr(0,e.length)==e?!0:!1},String.prototype.endWith=function(e){return null==e||""==e||0==this.length||e.length>this.length?!1:this.substring(this.length-e.length)==e?!0:!1};var AllViews={car_img:0,pop:0,place_name1:0,place_name2:0};