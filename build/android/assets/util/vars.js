function isGoogleMap(){return map_type.startWith("google")}function addMarker(e,t,i,r){return isGoogleMap()?addMyGoogleMarker(e,t[0],t[1],i,r):addMarkerMF([t[0],t[1]],i)}function removeMarker(e){isGoogleMap()?map.removeMarker(e):map.removeLayer(e)}function initVars(e){Ti.App.Properties.setString("map_type",e),map_type=e,Ti.App.Properties.setInt("MODE",0),setNodes(""),Ti.App.Properties.setInt("myCircle",0),Ti.App.Properties.setInt("mySpot",0),Ti.App.Properties.setString("dest_marker",""),Ti.App.Properties.setInt("route",0),Ti.App.Properties.setString("RouteMarkers",""),Ti.App.Properties.setString("by","car");var t={"-3":"turn sharp left","-2":"turn left","-1":"turn slight left",0:"continue",1:"turn slight right",2:"turn right",3:"turn sharp right",4:"finish",5:"reached via",6:"use roundabout"},i={0:"0",100:"100",200:"200",500:"500",1000:"1000",2000:"2000"},r=["car","bike","foot"],a=[Ti.App.Android.R.drawable.sedan_128,Ti.App.Android.R.drawable.bicycle_128,Ti.App.Android.R.drawable.runner_128];Ti.App.Properties.setString("bys",JSON.stringify(r)),Ti.App.Properties.setString("by_icons",JSON.stringify(a)),Ti.App.Properties.setString("GH_TURN_DICT",JSON.stringify(t)),Ti.App.Properties.setString("VOICE_PROMPT_DISTANCES",JSON.stringify(i)),setDestinatePos([0,0]),Ti.App.Properties.setString("played","{}"),Ti.App.Properties.setString("SavedPlaceMarkers","[]")}function setNaviMode(e){Ti.App.Properties.setInt("MODE",e)}function setSettingBy(e){Ti.App.Properties.setString("by",e)}function saveRouteInfo(e){Ti.App.Properties.setString("Nodes",JSON.stringify(e))}function savePolylineId(e){Ti.App.Properties.setInt("route",e)}function saveNodeMarker(e){Ti.App.Properties.setString("RouteMarkers",JSON.stringify(e))}function setEmptyPlayedList(e){var t={};Ti.App.Properties.setString("played",JSON.stringify(t))}function setPlayedList(e,t){var i=JSON.parse(Ti.App.Properties.getString("played"));i[""+e+"_"+t]="y",Ti.App.Properties.setString("played",JSON.stringify(i))}function isPlayed(e,t){var i=JSON.parse(Ti.App.Properties.getString("played"));return void 0!==i[""+e+"_"+t]&&"y"===i[""+e+"_"+t]?!0:!1}function getGHDict(){var e=Ti.App.Properties.getString("GH_TURN_DICT");return JSON.parse(e)}function getLabelById(e){return AllViews[e]}function getNodes(){return Ti.App.Properties.getString("Nodes")}function setNodes(e){Ti.App.Properties.setString("Nodes",e)}Array.prototype.remove||(Array.prototype.remove=function(e){var t=this.indexOf(e);return t>-1?this.splice(t,1):[]},Array.prototype.removeAt=function(e){return e>-1?this.splice(e,1):[]}),String.prototype.startWith=function(e){return null==e||""==e||0==this.length||e.length>this.length?!1:this.substr(0,e.length)==e?!0:!1},String.prototype.endWith=function(e){return null==e||""==e||0==this.length||e.length>this.length?!1:this.substring(this.length-e.length)==e?!0:!1};var GOOGLE_API_KEY="AIzaSyApl-_heZUCRD6bJ5TltYPn4gcSCy1LY3A",map_type,AllViews={car_img:0,pop:0,place_name1:0,place_name2:0};