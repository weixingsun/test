function createPlaceView(){var e=Ti.UI.createView({backgroundColor:"rgba(128,128,128,128)",width:"100%",height:"20%",layout:"vertical",id:"pop",bottom:0});return e.visible=!1,createRows(e),win.add(e),AllViews[e.id]=e,e}function createRows(e){var i=Ti.UI.createView({height:"60%",layout:"horizontal"}),t=Ti.UI.createView({height:"40%",layout:"horizontal"});e.add(i),e.add(t),createTopColumns(i),createBottomColumns(t)}function createTopColumns(e){{var i=Ti.UI.createView({width:"80%"}),t=Ti.UI.createView({width:"20%"}),r=Ti.App.Android.R.drawable.sedan_128;createCarImage(t,r)}createNameLabel(i),e.add(i),e.add(t)}function createNameLabel(e){var i=Ti.App.Properties.getDouble("dest_lat"),t=Ti.App.Properties.getDouble("dest_lng"),r="["+i+","+t+"]",n=Ti.UI.createLabel({color:"#900",font:{fontSize:20},shadowColor:"#aaa",shadowOffset:{x:5,y:5},shadowRadius:3,text:r,textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,top:10,left:5,width:Ti.UI.SIZE,height:Ti.UI.SIZE});e.add(n),AllViews.place_name=n}function createBottomColumns(e){{var i=Ti.UI.createView({width:"12%"}),t=Ti.UI.createView({width:"10%"}),r=Ti.UI.createView({width:"10%"}),n=(Ti.UI.createView({width:"10%"}),Ti.App.Android.R.drawable.close_64),o=Ti.App.Android.R.drawable.search_64,a=Ti.App.Android.R.drawable.parking_64,d=createImages(i,n);createImages(t,o),createImages(r,a)}d.addEventListener("click",function(e){e.source.parent.parent.parent.hide(),removePrevDestMarker(map);var i=Ti.App.Properties.getInt("route");0!==i&&map.removeLayer(i),Ti.App.Properties.setInt("MODE",0)}),e.add(i),e.add(t),e.add(r)}function createImages(e,i){var t=Titanium.UI.createImageView({image:i});return e.add(t),t}function createCarImage(e,i){var t=Titanium.UI.createImageView({image:i});return e.add(t),t.addEventListener("click",function(){var e=[Ti.App.Properties.getDouble("gps_lat"),Ti.App.Properties.getDouble("gps_lng")],i=[Ti.App.Properties.getDouble("dest_lat"),Ti.App.Properties.getDouble("dest_lng")];Ti.API.info("mf="+mf+",map="+map+",from="+e+",to="+i),navi(mf,map,e,i)}),t.addEventListener("longclick",function(){var e=JSON.parse(Ti.App.Properties.getString("bys")),i=Ti.App.Properties.getString("by"),t=e.indexOf(i),r=t==e.length-1?e[0]:e[t+1];Ti.API.info("nextBy="+r),Ti.App.Properties.setString("by",nextBy)}),t}function createAndroidSearchBar(){var e=Ti.UI.Android.createSearchView({backgroundColor:"rgba(128,128,128,128)",color:"black",width:"80%",top:0,left:10});e.addEventListener("change",function(e){Ti.API.info("search:"+e.source.value)}),e.addEventListener("return",function(){e.blur()}),win.add(e)}function createIosSearchBar(){var e=Titanium.UI.createSearchBar({width:"80%",showCancel:!0,height:43,top:5,left:10});e.addEventListener("change",function(e){e.value}),e.addEventListener("return",function(){e.blur()}),e.addEventListener("cancel",function(){e.blur()}),Ti.API.info("searchbar created"),win.add(e)}