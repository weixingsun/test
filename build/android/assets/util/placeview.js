function hidePopView(){var e=AllViews.pop;"undefined"!=typeof e&&0!==e&&e.hide()}function showPopView(e){getAddressGoogle(e[0],e[1],getAddressCallback);var i=AllViews.pop;"undefined"!=typeof i&&0!==i&&i.show()}function createPlaceView(){var e=Ti.UI.createView({backgroundColor:"rgba(128,128,128,128)",width:"100%",height:"20%",layout:"vertical",id:"pop",bottom:0});return e.visible=!1,createRows(e),win.add(e),AllViews.pop=e,e}function createRows(e){var i=Ti.UI.createView({height:"60%",layout:"horizontal"}),t=Ti.UI.createView({height:"40%",layout:"horizontal"});e.add(i),e.add(t),createTopColumns(i),createBottomColumns(t)}function createTopColumns(e){{var i=Ti.UI.createView({width:"80%",layout:"vertical"}),t=Ti.UI.createView({height:"60%"}),a=Ti.UI.createView({height:"40%"}),n=Ti.UI.createView({width:"20%"}),r=Ti.App.Android.R.drawable.sedan_128;createCarImage(n,r)}createAdressLabel(t,a),i.add(t),i.add(a),e.add(i),e.add(n)}function createAdressLabel(e,i){var t=Ti.App.Properties.getDouble("dest_lat"),a=Ti.App.Properties.getDouble("dest_lng"),n="["+t+","+a+"]",r=Ti.UI.createLabel({color:"#000",font:{fontSize:20},shadowColor:"#aaa",shadowOffset:{x:5,y:5},shadowRadius:3,text:n,textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,bottom:2,left:20,parent:e,width:Ti.UI.SIZE,height:Ti.UI.SIZE});e.add(r);var o=Ti.UI.createLabel({color:"#333",font:{fontSize:15},shadowColor:"#aaa",shadowOffset:{x:5,y:5},shadowRadius:3,text:"",textAlign:Ti.UI.TEXT_ALIGNMENT_CENTER,top:2,left:25,parent:i,width:Ti.UI.SIZE,height:Ti.UI.SIZE});i.add(o),AllViews.place_name1=r,AllViews.place_name2=o}function createBottomColumns(e){{var i=Ti.UI.createView({width:"12%"}),t=Ti.UI.createView({width:"10%"}),a=Ti.UI.createView({width:"10%"}),n=(Ti.UI.createView({width:"10%"}),Ti.App.Android.R.drawable.close_64),r=Ti.App.Android.R.drawable.search_64,o=Ti.App.Android.R.drawable.parking_64,d=createImages(i,n);createImages(t,r),createImages(a,o)}d.addEventListener("click",function(e){e.source.parent.parent.parent.hide(),removePrevAll();var i=Ti.App.Properties.getInt("route");0!==i&&map.removeLayer(i),Ti.App.Properties.setInt("MODE",0)}),e.add(i),e.add(t),e.add(a)}function createImages(e,i){var t=Titanium.UI.createImageView({image:i});return e.add(t),t}function createCarImage(e,i){var t=Titanium.UI.createImageView({image:i});return e.add(t),t.addEventListener("click",function(){var e=getCurrentPos(),i=[Ti.App.Properties.getDouble("dest_lat"),Ti.App.Properties.getDouble("dest_lng")];Ti.API.info("mf="+mf+",map="+map+",from="+e+",to="+i),navi(mf,map,e,i)}),t.addEventListener("longclick",function(e){var i=JSON.parse(Ti.App.Properties.getString("bys")),t=Ti.App.Properties.getString("by"),a=i.indexOf(t),n=a==i.length-1?0:a+1,r=i[n];Ti.API.info("nextBy="+r),Ti.App.Properties.setString("by",r);var o=JSON.parse(Ti.App.Properties.getString("by_icons")),d=o[n];e.source.image=d}),AllViews.car_img=t,t}